'use client'

import { useEffect, useState } from 'react'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { toast } from 'react-toastify'

import Form from '@components/Form'

import CustomTextField from '@core/components/mui/TextField'

export interface FormField {
  name: string
  label: string
  placeholder?: string
  type?: 'text' | 'textarea' | 'number' | 'email'
  validation?: Yup.AnySchema
}

export interface FileUploadFormProps {
  fields: FormField[]
  onSubmit: (values: any) => Promise<void>
  initialData?: any
  imageField: {
    name: string
    label: string
    accept?: string
    maxSize?: number // in bytes
    previewUrl?: string
  }
  submitButtonText?: string
}

const createValidationSchema = (fields: FormField[], imageField: FileUploadFormProps['imageField']) => {
  const schemaFields = fields.reduce(
    (acc, field) => {
      acc[field.name] = field.validation || Yup.string().required(`${field.label} is required`)

      return acc
    },
    {} as { [key: string]: Yup.AnySchema }
  )

  schemaFields[imageField.name] = Yup.mixed()
    .test('fileOrString', `${imageField.label} is required`, function (value) {
      return value instanceof File || (typeof value === 'string' && value.length > 0)
    })
    .test('fileSize', 'File is too large', value => {
      if (value instanceof File && imageField.maxSize) {
        return value.size <= imageField.maxSize
      }

      return true
    })
    .test('fileType', 'Unsupported file format', value => {
      if (value instanceof File && imageField.accept) {
        const acceptedTypes = imageField.accept.split(',').map(type => type.trim())

        return acceptedTypes.includes(value.type)
      }

      return true
    })

  return Yup.object(schemaFields)
}

const FileUploadForm = ({
  fields,
  onSubmit,
  initialData,
  imageField,
  submitButtonText = 'Submit'
}: FileUploadFormProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const initialValues = fields.reduce(
    (acc, field) => {
      acc[field.name] = ''

      return acc
    },
    {} as { [key: string]: any }
  )

  initialValues[imageField.name] = null

  const validationSchema = createValidationSchema(fields, imageField)

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async values => {
      try {
        const formData = new FormData()

        Object.keys(values).forEach(key => {
          formData.append(key, values[key])
        })
        await onSubmit(formData)
        toast.success('Operation completed successfully')
      } catch (err: any) {
        toast.error(`Operation failed: ${err?.message || 'Unknown error'}`)
      }
    }
  })

  useEffect(() => {
    if (initialData) {
      setPreviewUrl(initialData[imageField.name])
      formik.setValues(initialData, true)
    }
  }, [initialData])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      formik.setFieldValue(imageField.name, file)
      const reader = new FileReader()

      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }

      reader.readAsDataURL(file)
    }
  }

  return (
    <Card>
      <CardContent>
        <Form onSubmit={formik.handleSubmit}>
          <Grid container spacing={6}>
            {fields.map(field => (
              <Grid key={field.name} size={{ xs: 12 }}>
                <CustomTextField
                  fullWidth
                  name={field.name}
                  label={field.label}
                  placeholder={field.placeholder || field.label}
                  type={field.type || 'text'}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
                  helperText={formik.touched[field.name] && formik.errors[field.name]}
                  multiline={field.type === 'textarea'}
                  rows={field.type === 'textarea' ? 4 : 1}
                />
              </Grid>
            ))}
            <Grid>
              <input
                type='file'
                accept={imageField.accept || 'image/*'}
                id={`${imageField.name}-upload`}
                name={imageField.name}
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor={`${imageField.name}-upload`}>
                <Card
                  sx={{
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed',
                    borderColor:
                      formik.touched[imageField.name] && formik.errors[imageField.name] ? 'error.main' : 'primary.main',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor:
                        formik.touched[imageField.name] && formik.errors[imageField.name]
                          ? 'error.dark'
                          : 'primary.dark',
                      opacity: 0.8
                    }
                  }}
                >
                  {previewUrl ? (
                    <Box
                      component='img'
                      src={previewUrl}
                      alt={`${imageField.label} preview`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <i className='tabler-upload' style={{ fontSize: '2rem' }} />
                      <Typography variant='body1' color='primary' sx={{ mt: 2 }}>
                        Upload {imageField.label}
                      </Typography>
                      <Typography variant='caption' color='textSecondary'>
                        Click to select a file
                      </Typography>
                    </Box>
                  )}
                </Card>
              </label>
              {formik.touched[imageField.name] && formik.errors[imageField.name] && (
                <Typography color='error' variant='caption' sx={{ mt: 1, display: 'block' }}>
                  {String(formik.errors[imageField.name])}
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
              {submitButtonText}
            </Button>
          </Box>
        </Form>
      </CardContent>
    </Card>
  )
}

export default FileUploadForm
