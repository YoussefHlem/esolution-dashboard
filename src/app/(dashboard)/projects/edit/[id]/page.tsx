'use client'

import { Card, CardContent, Typography } from '@mui/material'

import ProjectForm from '@components/forms/ProjectForm'

export default function EditDownloadPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant='h5' component='h1'>
            Edit Project
          </Typography>
        </CardContent>
      </Card>
      <ProjectForm id={params.id} />
    </>
  )
}
