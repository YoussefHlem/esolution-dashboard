'use client'

import { Card, CardContent, Typography } from '@mui/material'

import BlogForm from '@components/forms/BlogForm'

export default function CreateBlogPage() {
  return (
    <>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant='h5' component='h1'>
            Create New Blog
          </Typography>
        </CardContent>
      </Card>
      <BlogForm />
    </>
  )
}
