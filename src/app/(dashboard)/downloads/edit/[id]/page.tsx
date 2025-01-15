'use client'

import { Card, CardContent, Typography } from '@mui/material'

import DownloadForm from '@components/forms/DownloadForm'

export default function EditDownloadPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant='h5' component='h1'>
            Edit Download
          </Typography>
        </CardContent>
      </Card>
      <DownloadForm id={params.id} />
    </>
  )
}
