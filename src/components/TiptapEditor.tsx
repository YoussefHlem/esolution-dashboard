import type { FC } from 'react'
import { useEffect, useState } from 'react'

import { EditorContent, useEditor } from '@tiptap/react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { StarterKit } from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Image } from '@tiptap/extension-image'
import { TextAlign } from '@tiptap/extension-text-align'
import { Underline } from '@tiptap/extension-underline'
import { Heading } from '@tiptap/extension-heading'
import { Bold } from '@tiptap/extension-bold'
import { Paragraph } from '@tiptap/extension-paragraph'
import { TextStyle } from '@tiptap/extension-text-style'
import { Code } from '@tiptap/extension-code'
import { Strike } from '@tiptap/extension-strike'
import { Italic } from '@tiptap/extension-italic'
import { CodeBlock } from '@tiptap/extension-code-block'
import { HorizontalRule } from '@tiptap/extension-horizontal-rule'
import { HardBreak } from '@tiptap/extension-hard-break'
import { Link } from '@tiptap/extension-link' // Import Link extension
// Material icons
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough'
import CodeIcon from '@mui/icons-material/Code'
import FormatClearIcon from '@mui/icons-material/FormatClear'
import RemoveIcon from '@mui/icons-material/Remove'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import CodeOffIcon from '@mui/icons-material/CodeOff'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import ImageIcon from '@mui/icons-material/Image'
import LinkIcon from '@mui/icons-material/Link'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

interface TiptapEditorProps {
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  label?: string
}

const TiptapEditor: FC<TiptapEditorProps> = ({ value, onChange, error, placeholder, label }) => {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [linkTargetBlank, setLinkTargetBlank] = useState(true)

  const editor = useEditor({
    extensions: [
      TextStyle,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false
        }
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Write here...'
      }),
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6]
      }),
      Bold,
      Italic,
      Strike,
      Code,
      Paragraph,
      CodeBlock,
      HorizontalRule,
      HardBreak,
      Link.configure({
        openOnClick: false, // Prevents links from being followed on click in the editor
        linkOnPaste: true, // Automatically turns pasted URLs into links
        HTMLAttributes: {
          // Default HTML attributes for links
          rel: 'noopener noreferrer',
          class: 'tiptap-link'
        },
        validate: href => /^https?:\/\//.test(href) || href.startsWith('/') || href.startsWith('#') // Basic URL validation
      })
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  // Sync external `value` prop with editor content
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value || '<p></p>')
    }
  }, [value, editor])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file && editor) {
      const reader = new FileReader()

      reader.onload = () => {
        editor
          .chain()
          .focus()
          .setImage({ src: reader.result as string })
          .run()
      }

      reader.readAsDataURL(file)
    }
  }

  // Open link dialog with current selection text
  const openLinkDialog = () => {
    if (editor) {
      const { from, to } = editor.state.selection
      const text = editor.state.doc.textBetween(from, to, '')

      setLinkText(text)

      // If a link is selected, get its URL and target
      if (editor.isActive('link')) {
        const linkAttrs = editor.getAttributes('link')

        setLinkUrl(linkAttrs.href || '')
        setLinkTargetBlank(linkAttrs.target === '_blank')
      } else {
        setLinkUrl('')
        setLinkTargetBlank(true)
      }

      setLinkDialogOpen(true)
    }
  }

  // Apply the link to the selected text
  const applyLink = () => {
    if (editor) {
      // Format the URL if it doesn't have a protocol
      let formattedUrl = linkUrl

      if (
        formattedUrl &&
        !formattedUrl.startsWith('http://') &&
        !formattedUrl.startsWith('https://') &&
        !formattedUrl.startsWith('/') &&
        !formattedUrl.startsWith('#')
      ) {
        formattedUrl = `https://${formattedUrl}`
      }

      // Link attributes
      const linkAttrs = {
        href: formattedUrl,
        target: linkTargetBlank ? '_blank' : null,
        rel: linkTargetBlank ? 'noopener noreferrer' : null
      }

      // If there's no text selected and link text is provided, insert it
      if (editor.state.selection.empty && linkText.trim() !== '') {
        editor
          .chain()
          .focus()
          .insertContent(linkText)
          .setTextSelection({
            from: editor.state.selection.from - linkText.length,
            to: editor.state.selection.from
          })
          .setLink(linkAttrs)
          .run()
      } else {
        // Apply link to selected text
        editor.chain().focus().setLink(linkAttrs).run()
      }

      setLinkDialogOpen(false)
    }
  }

  // Remove link from selection
  const removeLink = () => {
    if (editor) {
      editor.chain().focus().unsetLink().run()
    }
  }

  if (!editor) {
    return null
  }

  return (
    <Box>
      {label && (
        <Typography variant='body1' sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}

      <Box
        sx={{
          border: '1px solid #e1def538',
          borderRadius: 1,
          mb: 2,
          p: 1
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            p: 0.5,
            alignItems: 'center',
            gap: 0.25
          }}
        >
          {/* Paragraph and headings */}
          <Select
            value={editor.getAttributes('heading').level || 0}
            onChange={e => {
              const level = parseInt(e.target.value as string, 10)

              if (level === 0) {
                editor.chain().focus().setParagraph().run()
              } else {
                editor.chain().focus().setHeading({ level }).run()
              }
            }}
            size='small'
            sx={{ minWidth: 100, mr: 0.5 }}
          >
            <MenuItem value={0}>Paragraph</MenuItem>
            <MenuItem value={1}>Heading 1</MenuItem>
            <MenuItem value={2}>Heading 2</MenuItem>
            <MenuItem value={3}>Heading 3</MenuItem>
            <MenuItem value={4}>Heading 4</MenuItem>
            <MenuItem value={5}>Heading 5</MenuItem>
            <MenuItem value={6}>Heading 6</MenuItem>
          </Select>

          <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

          {/* Text formatting */}
          <Tooltip title='Bold'>
            <IconButton
              size='small'
              onClick={() => editor.chain().focus().toggleBold().run()}
              color={editor.isActive('bold') ? 'primary' : 'default'}
              disabled={!editor.can().chain().focus().toggleBold().run()}
            >
              <FormatBoldIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Italic'>
            <IconButton
              size='small'
              onClick={() => editor.chain().focus().toggleItalic().run()}
              color={editor.isActive('italic') ? 'primary' : 'default'}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
            >
              <FormatItalicIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Underline'>
            <IconButton
              size='small'
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              color={editor.isActive('underline') ? 'primary' : 'default'}
            >
              <FormatUnderlinedIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Strikethrough'>
            <IconButton
              size='small'
              onClick={() => editor.chain().focus().toggleStrike().run()}
              color={editor.isActive('strike') ? 'primary' : 'default'}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
            >
              <FormatStrikethroughIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Code'>
            <IconButton
              size='small'
              onClick={() => editor.chain().focus().toggleCode().run()}
              color={editor.isActive('code') ? 'primary' : 'default'}
              disabled={!editor.can().chain().focus().toggleCode().run()}
            >
              <CodeIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          {/* Add Link buttons */}
          <Tooltip title='Add/Edit Link'>
            <IconButton size='small' onClick={openLinkDialog} color={editor.isActive('link') ? 'primary' : 'default'}>
              <LinkIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Remove Link'>
            <IconButton size='small' onClick={removeLink} disabled={!editor.isActive('link')}>
              <LinkOffIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

          {/* Lists, code blocks, quotes */}
          <Tooltip title='Bullet List'>
            <IconButton
              size='small'
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              color={editor.isActive('bulletList') ? 'primary' : 'default'}
            >
              <FormatListBulletedIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Ordered List'>
            <IconButton
              size='small'
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              color={editor.isActive('orderedList') ? 'primary' : 'default'}
            >
              <FormatListNumberedIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Code Block'>
            <IconButton
              size='small'
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              color={editor.isActive('codeBlock') ? 'primary' : 'default'}
            >
              <CodeOffIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Blockquote'>
            <IconButton
              size='small'
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              color={editor.isActive('blockquote') ? 'primary' : 'default'}
            >
              <FormatQuoteIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

          {/* Alignment */}
          <Tooltip title='Align Left'>
            <IconButton
              size='small'
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              color={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'}
            >
              <FormatAlignLeftIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Align Center'>
            <IconButton
              size='small'
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              color={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'}
            >
              <FormatAlignCenterIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Align Right'>
            <IconButton
              size='small'
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              color={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'}
            >
              <FormatAlignRightIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

          {/* Special elements */}
          <Tooltip title='Horizontal Rule'>
            <IconButton size='small' onClick={() => editor.chain().focus().setHorizontalRule().run()}>
              <HorizontalRuleIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Hard Break'>
            <IconButton size='small' onClick={() => editor.chain().focus().setHardBreak().run()}>
              <KeyboardReturnIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

          {/* Clear formatting */}
          <Tooltip title='Clear Marks'>
            <IconButton size='small' onClick={() => editor.chain().focus().unsetAllMarks().run()}>
              <FormatClearIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Clear Nodes'>
            <IconButton size='small' onClick={() => editor.chain().focus().clearNodes().run()}>
              <RemoveIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

          {/* History and image */}
          <Tooltip title='Undo'>
            <IconButton
              size='small'
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
            >
              <UndoIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Redo'>
            <IconButton
              size='small'
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
            >
              <RedoIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Upload Image'>
            <IconButton component='label' size='small'>
              <ImageIcon fontSize='small' />
              <input type='file' hidden onChange={handleImageUpload} />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider />

        <Box
          sx={{
            minHeight: 200,
            padding: 2,
            '& .ProseMirror': {
              outline: 'none'
            },
            '& .ProseMirror img': {
              maxWidth: '100%',
              height: 'auto'
            },
            '& .ProseMirror a': {
              color: 'primary.main',
              textDecoration: 'underline',
              cursor: 'pointer'
            },
            '& .ProseMirror .tiptap-link': {
              color: 'primary.main',
              textDecoration: 'underline',
              cursor: 'pointer'
            }
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Box>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)}>
        <DialogTitle>Insert/Edit Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            id='link-text'
            label='Link Text'
            type='text'
            fullWidth
            variant='outlined'
            value={linkText}
            onChange={e => setLinkText(e.target.value)}
            sx={{ mb: 2 }}
            disabled={!editor?.state.selection.empty}
          />
          <TextField
            margin='dense'
            id='link-url'
            label='Link URL'
            type='url'
            fullWidth
            variant='outlined'
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            placeholder='https://example.com'
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Open link in new tab'>
              <IconButton
                size='small'
                onClick={() => setLinkTargetBlank(!linkTargetBlank)}
                color={linkTargetBlank ? 'primary' : 'default'}
              >
                <OpenInNewIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            <Typography variant='body2' sx={{ ml: 1 }}>
              Open link in new tab
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
          <Button onClick={applyLink} variant='contained' disabled={!linkUrl}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Typography color='error' variant='caption' sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}

export default TiptapEditor
