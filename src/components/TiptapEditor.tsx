import type { FC } from 'react'
import { useEffect } from 'react'

import { EditorContent, useEditor } from '@tiptap/react'
import { Box, Button, MenuItem, Select, Typography } from '@mui/material'
import { StarterKit } from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Image } from '@tiptap/extension-image'
import { TextAlign } from '@tiptap/extension-text-align'
import { Underline } from '@tiptap/extension-underline'
import { Heading } from '@tiptap/extension-heading'
import { Bold } from '@tiptap/extension-bold'
import { Paragraph } from '@tiptap/extension-paragraph'

interface TiptapEditorProps {
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  label?: string
}

const TiptapEditor: FC<TiptapEditorProps> = ({ value, onChange, error, placeholder, label }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
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
      Paragraph
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
          display: 'flex',
          gap: 1,
          mb: 2,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
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
        >
          <MenuItem value={0}>Paragraph</MenuItem>
          <MenuItem value={1}>Heading 1</MenuItem>
          <MenuItem value={2}>Heading 2</MenuItem>
          <MenuItem value={3}>Heading 3</MenuItem>
        </Select>
        <Button
          size='small'
          onClick={() => editor.chain().focus().toggleBold().run()}
          variant={editor.isActive('bold') ? 'contained' : 'outlined'}
        >
          Bold
        </Button>
        <Button
          size='small'
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          variant={editor.isActive('underline') ? 'contained' : 'outlined'}
        >
          Underline
        </Button>
        <Button
          size='small'
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          variant={editor.isActive({ textAlign: 'left' }) ? 'contained' : 'outlined'}
        >
          Left
        </Button>
        <Button
          size='small'
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          variant={editor.isActive({ textAlign: 'center' }) ? 'contained' : 'outlined'}
        >
          Center
        </Button>
        <Button
          size='small'
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          variant={editor.isActive({ textAlign: 'right' }) ? 'contained' : 'outlined'}
        >
          Right
        </Button>

        {/*<Button component='label' size='small' variant='outlined'>*/}
        {/*  Upload Image*/}
        {/*  <input type='file' hidden onChange={handleImageUpload} />*/}
        {/*</Button>*/}
      </Box>
      <Box
        sx={{
          border: '1px solid',
          borderColor: error ? 'error.main' : 'grey.300',
          borderRadius: 1,
          minHeight: 200,
          padding: 2,
          '& .ProseMirror': {
            outline: 'none'
          },
          '& .ProseMirror img': {
            maxWidth: '1200px',
            height: 'auto'
          }
        }}
      >
        <EditorContent editor={editor} />
      </Box>

      {error && (
        <Typography color='error' variant='caption' sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}

export default TiptapEditor
