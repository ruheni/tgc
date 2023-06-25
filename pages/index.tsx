import type { NextPage } from "next";
import Link from "next/link";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const Home: NextPage = () => {
  return (
    <Container maxWidth="sm">
      <Box>
        <Link href="/notes" passHref>
          <a>Notes</a>
        </Link>
      </Box>
      <Box>
        <Link href="/graph" passHref>
          <a>Graph</a>
        </Link>
      </Box>
    </Container>
  );
};

export default Home;
