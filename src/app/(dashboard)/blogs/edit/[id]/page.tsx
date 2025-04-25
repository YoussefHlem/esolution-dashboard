'use client'

import { Card, CardContent, Typography } from '@mui/material'

import BlogForm from '@components/forms/BlogForm'

export default function EditBlogPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant='h5' component='h1'>
            Edit Blog
          </Typography>
        </CardContent>
      </Card>
      <BlogForm id={params.id} />
    </>
  )
}
