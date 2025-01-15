import Grid from '@mui/material/Grid2'

import DownloadsTable from '@components/tables/DownloadsTable'

export default function Page() {
  return (
    <>
      <Grid container>
        <Grid size={{ xs: 12 }}>
          <DownloadsTable />
        </Grid>
      </Grid>
    </>
  )
}
