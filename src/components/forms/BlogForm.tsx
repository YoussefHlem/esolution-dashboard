'use client'

import { useEffect, useState } from 'react'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Box, Button, Card, CardContent, Chip, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'

import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import Form from '@components/Form'
import { blogsApi } from '@/api/blogs'
import TiptapEditor from '@components/TiptapEditor'
import { ImageUploadField } from '@components/ImageUploadField'

// Define the validation schema including tags
const validationSchema = Yup.object({
  title: Yup.string().required('Title is required').min(2, 'Title must be at least 2 characters'),
  description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  body: Yup.string().required('Body is required'),
  image: Yup.mixed()
    .required('Image is required')
    .test('fileType', 'Only image files are supported', value => {
      if (value instanceof File) {
        return value.type.startsWith('image/')
      }

      return true
    }),
  tags: Yup.array().of(Yup.string())
})

// Define interface for form values
interface BlogFormValues {
  title: string
  description: string
  body: string
  image: File | string | null
  tags: string[]
}

const BlogForm = ({ id }: { id?: number }) => {
  const [newTag, setNewTag] = useState<string>('')
  const [tagError, setTagError] = useState<string>('')

  const formik = useFormik<BlogFormValues>({
    initialValues: {
      title: '',
      description: '',
      body: '',
      image: null,
      tags: []
    },
    validationSchema,
    onSubmit: async values => {
      const formData = new FormData()

      // Add all form values to FormData
      Object.keys(values).forEach(key => {
        if (key === 'tags') {
          // For tags, we need to stringify the array
          formData.append(key, JSON.stringify(values.tags))
        } else {
          formData.append(key, values[key as keyof BlogFormValues])
        }
      })

      try {
        id ? await blogsApi.update(id, formData) : await blogsApi.create(formData)
        toast.success(`Blog ${id ? 'Updated' : 'Created'} successfully`)
      } catch (err: any) {
        toast.error(`Failed to ${id ? 'Update' : 'Create'} Blog: ${err.response?.data?.message || err.message}`)
      }
    }
  })

  useEffect(() => {
    if (id) {
      blogsApi.get(id).then(data => {
        formik.setValues({
          title: data.title,
          description: data.description,
          body: data.body,
          image: data.image,
          tags: data.tags || [] // Make sure to handle tags from the API response
        })
      })
    }
  }, [id])

  // Handle file changes for image upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      formik.setFieldValue('image', file)
    }
  }

  // Handle adding a new tag
  const handleAddTag = () => {
    const trimmedTag = newTag.trim()

    // Validate tag
    if (!trimmedTag) {
      setTagError('Tag cannot be empty')

      return
    }

    if (trimmedTag.length < 2) {
      setTagError('Tag must be at least 2 characters')

      return
    }

    if (formik.values.tags.includes(trimmedTag)) {
      setTagError('Tag already exists')

      return
    }

    // Add the tag to the form values
    formik.setFieldValue('tags', [...formik.values.tags, trimmedTag])
    setNewTag('') // Clear the input
    setTagError('') // Clear any errors
  }

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    formik.setFieldValue(
      'tags',
      formik.values.tags.filter(tag => tag !== tagToRemove)
    )
  }

  // Handle Enter key press to add tag
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAddTag()
    }
  }

  return (
    <Card>
      <CardContent>
        <Form onSubmit={formik.handleSubmit}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                name='title'
                label='Title'
                placeholder='Enter title'
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                name='description'
                label='Description'
                placeholder='Enter description'
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TiptapEditor
                value={formik.values.body}
                onChange={value => formik.setFieldValue('body', value)}
                error={formik.touched.body && formik.errors.body ? formik.errors.body : undefined}
                placeholder='Write the blog content here...'
                label='Body'
              />
              {formik.touched.body && formik.errors.body && (
                <Typography color='error' variant='caption' sx={{ mt: 1, display: 'block' }}>
                  {formik.errors.body}
                </Typography>
              )}
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ImageUploadField formik={formik} previewUrl={formik.values.image} onImageChange={handleFileChange} />
            </Grid>

            {/* Tags Section */}
            <Grid size={{ xs: 12 }}>
              <Typography variant='subtitle1' sx={{ mb: 2 }}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  size='small'
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder='Add new tag'
                  error={!!tagError}
                  helperText={tagError}
                  sx={{ flexGrow: 1, mr: 2 }}
                />
                <Button variant='contained' color='primary' startIcon={<AddIcon />} onClick={handleAddTag} size='small'>
                  Add
                </Button>
              </Box>

              {/* Tag display area */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {formik.values.tags.map((tag, index) => (
                  <Chip
                    key={`${tag}-${index}`}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color='primary'
                    variant='outlined'
                    deleteIcon={<CloseIcon />}
                  />
                ))}
                {formik.values.tags.length === 0 && (
                  <Typography variant='body2' color='text.secondary'>
                    No tags added yet. Add some tags to categorize your blog post.
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4 }}>
            <Button
              fullWidth
              type='submit'
              variant='contained'
              color='primary'
              disabled={!formik.isValid || formik.isSubmitting}
            >
              Submit
            </Button>
          </Box>
        </Form>
      </CardContent>
    </Card>
  )
}

export default BlogForm
