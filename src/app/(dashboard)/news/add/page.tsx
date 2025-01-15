'use client'

import { Card, CardContent, Typography } from '@mui/material'

import NewsForm from '@components/forms/NewsForm'

export default function CreateDownloadPage() {
  return (
    <>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant='h5' component='h1'>
            Create New News
          </Typography>
        </CardContent>
      </Card>
      <NewsForm />
    </>
  )
}
