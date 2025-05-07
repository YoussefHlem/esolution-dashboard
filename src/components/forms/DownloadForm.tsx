'use client'
import { useEffect } from 'react'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Box, Button, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material'
import Grid from '@mui/material/Grid2'

import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import Form from '@components/Form'
import { downloadsApi } from '@/api/downloads'

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required').min(2, 'Title must be at least 2 characters'),
  description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  tag: Yup.string().required('Tag is required').oneOf(['brochure', 'flyers', 'technical'], 'Invalid tag value'),
  pdf: Yup.mixed()
    .required('PDF file is required')
    .test('fileType', 'Only PDF files are supported', value => {
      if (value instanceof File) {
        return value.type === 'application/pdf'
      }

      return true
    })
})

const DownloadForm = ({ id }: { id?: number }) => {
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      tag: '',
      pdf: null
    },
    validationSchema,
    onSubmit: async values => {
      const formData = new FormData()

      Object.keys(values).forEach(key => {
        formData.append(key, values[key])
      })

      try {
        id ? await downloadsApi.update(id, formData) : await downloadsApi.create(formData)
        toast.success(`Download ${id ? 'Updated' : 'Created'} successfully`)
      } catch (err) {
        toast.error(`Failed to ${id ? 'Update' : 'Create'} Download: ${err.response.data.message}`)
      }
    }
  })

  useEffect(() => {
    if (id) {
      downloadsApi.get(id).then(data => {
        formik.setValues({
          title: data.title,
          description: data.description,
          tag: data.tag || '',
          pdf: data.pdfAttachment
        })
      })
    }
  }, [])

  const handleFileChange = event => {
    const file = event.target.files[0]

    if (file) {
      formik.setFieldValue('pdf', file)
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
              <FormControl
                fullWidth
                error={formik.touched.tag && Boolean(formik.errors.tag)}
              >
                <InputLabel id="tag-select-label">Tag</InputLabel>
                <Select
                  labelId="tag-select-label"
                  id="tag-select"
                  name="tag"
                  value={formik.values.tag}
                  label="Tag"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="brochure">Brochure</MenuItem>
                  <MenuItem value="flyers">Flyers</MenuItem>
                  <MenuItem value="technical">Technical</MenuItem>
                </Select>
                {formik.touched.tag && formik.errors.tag && (
                  <FormHelperText>{formik.errors.tag}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <input
                type='file'
                accept='application/pdf'
                id='pdf-upload'
                name='pdf'
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label htmlFor='pdf-upload'>
                <Button variant='outlined' component='span' sx={{ mt: 2 }}>
                  Upload PDF
                </Button>
              </label>
              {formik.values.pdf && (
                <Typography variant='body2' sx={{ mt: 2 }}>
                  File: {formik.values.pdf.name}
                </Typography>
              )}
              {formik.touched.pdf && formik.errors.pdf && (
                <Typography color='error' variant='caption' sx={{ mt: 1, display: 'block' }}>
                  {formik.errors.pdf}
                </Typography>
              )}
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

export default DownloadForm
