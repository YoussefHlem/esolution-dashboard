import Grid from '@mui/material/Grid2'

import BlogTable from '@components/tables/BlogTable'

export default function Page() {
  return (
    <>
      <Grid container>
        <Grid size={{ xs: 12 }}>
          <BlogTable />
        </Grid>
      </Grid>
    </>
  )
}
