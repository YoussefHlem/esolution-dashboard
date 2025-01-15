import { Container, Typography } from '@mui/material'

export default function Page() {
  return (
    <Container maxWidth='sm' style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant='h2' component='h1' gutterBottom>
        Welcome to Esolution Panel!
      </Typography>
    </Container>
  )
}
