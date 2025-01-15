'use client'

import { Card, CardContent, Typography } from '@mui/material'

import EquipmentForm from '@components/forms/EquipmentForm'

export default function EditDownloadPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant='h5' component='h1'>
            Edit Equipment
          </Typography>
        </CardContent>
      </Card>
      <EquipmentForm id={params.id} />
    </>
  )
}
