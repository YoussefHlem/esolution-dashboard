import Grid from '@mui/material/Grid2'

import EquipmentsTable from '@components/tables/EquipmentsTable'

export default function Page() {
  return (
    <>
      <Grid container>
        <Grid size={{ xs: 12 }}>
          <EquipmentsTable />
        </Grid>
      </Grid>
    </>
  )
}
