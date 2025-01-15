import Grid from '@mui/material/Grid2'

import NewsTable from '@components/tables/NewsTable'

export default function Page() {
  return (
    <>
      <Grid container>
        <Grid size={{ xs: 12 }}>
          <NewsTable />
        </Grid>
      </Grid>
    </>
  )
}
