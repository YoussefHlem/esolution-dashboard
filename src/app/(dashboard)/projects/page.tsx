import Grid from '@mui/material/Grid2'

import ProjectsTable from '@components/tables/ProjectsTable'

export default function Page() {
  return (
    <>
      <Grid container>
        <Grid size={{ xs: 12 }}>
          <ProjectsTable />
        </Grid>
      </Grid>
    </>
  )
}
