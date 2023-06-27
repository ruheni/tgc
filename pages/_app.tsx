import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './globals.css'
import type { AppProps } from 'next/app'
import React from 'react';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Link from "next/link";
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient();

const pages = ['Notes', 'Graph'];

function ResponsiveAppBar() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <AppBar position="static" sx={{ marginBottom: "20px" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Link href="/" passHref>
              <Button
                sx={{
                  my: 2,
                  color: router.pathname === '/' ? theme.palette.primary.contrastText : 'white',
                  bgcolor: router.pathname === '/' ? theme.palette.primary.dark : theme.palette.primary.main,
                  display: 'block'
                }}
              >Home</Button>
            </Link>
            {pages.map((page) => {
              const route = `/${page.toLowerCase()}`;
              const isSelected = router.pathname === route;
              return (
                <Link href={route} passHref key={page}>
                  <Button
                    sx={{
                      my: 2,
                      color: isSelected ? theme.palette.primary.contrastText : 'white',
                      bgcolor: isSelected ? theme.palette.primary.dark : theme.palette.primary.main,
                      display: 'block'
                    }}
                  >{page}</Button>
                </Link>
              )
            })}
          </Box>

        </Toolbar>
      </Container>
    </AppBar >
  );
}


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient} >
      <div>
        <ResponsiveAppBar />
        <Component {...pageProps} />
      </div>
    </QueryClientProvider >
  );
}

export default MyApp
