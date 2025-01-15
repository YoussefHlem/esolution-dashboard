'use client'

import { Card, CardContent, Typography } from '@mui/material'

import EquipmentForm from '@components/forms/EquipmentForm'

export default function CreateDownloadPage() {
  return (
    <>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant='h5' component='h1'>
            Create New Equipment
          </Typography>
        </CardContent>
      </Card>
      <EquipmentForm />
    </>
  )
}
