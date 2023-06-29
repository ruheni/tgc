import type { NextPage } from 'next'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'

const Home: NextPage = () => {
  return (
    <Container
      maxWidth="sm"
      className="homePageLinkContainer"
      sx={{ paddingTop: '25px' }}
    >
      <Box className="homeBox">
        <Link href="/notes" passHref>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Notes
              </Typography>
            </CardContent>
          </Card>
        </Link>
      </Box>
      <Box className="homeBox">
        <Link href="/graph" passHref>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                <a>Graph</a>
              </Typography>
            </CardContent>
          </Card>
        </Link>
      </Box>
    </Container>
  )
}

export default Home
