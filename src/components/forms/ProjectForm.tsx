'use client'

import { useEffect } from 'react'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Box, Button, Card, CardContent } from '@mui/material'
import Grid from '@mui/material/Grid2'

import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import Form from '@components/Form'
import { projectsApi } from '@/api/projects'
import { ImageUploadField } from '@components/ImageUploadField'

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required').min(2, 'Title must be at least 2 characters'),
  description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  image: Yup.mixed()
    .required('Image is required')
    .test('fileType', 'Only image files are supported', value => {
      if (value instanceof File) {
        return value.type.startsWith('image/')
      }

      return true
    })
})

const ProjectForm = ({ id }: { id?: number }) => {
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      image: null
    },
    validationSchema,
    onSubmit: async values => {
      const formData = new FormData()

      Object.keys(values).forEach(key => {
        formData.append(key, values[key])
      })

      try {
        id ? await projectsApi.update(id, formData) : await projectsApi.create(formData)
        toast.success(`Project ${id ? 'Updated' : 'Created'} successfully`)
      } catch (err) {
        toast.error(`Failed to ${id ? 'Update' : 'Create'} Project: ${err.response?.data?.message || err.message}`)
      }
    }
  })

  useEffect(() => {
    if (id) {
      projectsApi.get(id).then(data => {
        formik.setValues({
          title: data.title,
          description: data.description,
          image: data.image
        })
      })
    }
  }, [])

  const handleFileChange = event => {
    const file = event.target.files[0]

    if (file) {
      formik.setFieldValue('image', file)
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
              <ImageUploadField formik={formik} previewUrl={formik.values.image} onImageChange={handleFileChange} />
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

export default ProjectForm
