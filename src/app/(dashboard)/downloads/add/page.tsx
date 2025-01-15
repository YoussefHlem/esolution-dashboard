'use client'

import { Card, CardContent, Typography } from '@mui/material'

import DownloadForm from '@components/forms/DownloadForm'

export default function CreateDownloadPage() {
  return (
    <>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant='h5' component='h1'>
            Create New Download
          </Typography>
        </CardContent>
      </Card>
      <DownloadForm />
    </>
  )
}
