'use client'

import { Card, CardContent, Typography } from '@mui/material'

import ProjectForm from '@components/forms/ProjectForm'

export default function CreateDownloadPage() {
  return (
    <>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant='h5' component='h1'>
            Create New Project
          </Typography>
        </CardContent>
      </Card>
      <ProjectForm />
    </>
  )
}
