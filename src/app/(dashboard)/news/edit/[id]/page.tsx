'use client'

import { Card, CardContent, Typography } from '@mui/material'

import NewsForm from '@components/forms/NewsForm'

export default function EditDownloadPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant='h5' component='h1'>
            Edit News
          </Typography>
        </CardContent>
      </Card>
      <NewsForm id={params.id} />
    </>
  )
}
