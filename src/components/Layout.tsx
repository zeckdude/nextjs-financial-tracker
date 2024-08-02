import Head from 'next/head';
import Container from '@mui/material/Container';
import { NavBar } from '@/components/NavBar';
import { Box } from '@mui/material';

type LayoutProps = {
  pageName: string;
  children: React.ReactNode;
};

export function Layout({ pageName, children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>Tenhil Coding Challenge - {pageName}</title>
        <meta name="description" content="Chris Seckler coding challenge submission for Tenhil Interview" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="https://tenhil.de/wp-content/uploads/2022/05/cropped-favicon-1-32x32.png"
          sizes="32x32"
        ></link>
        <link
          rel="icon"
          href="https://tenhil.de/wp-content/uploads/2022/05/cropped-favicon-1-192x192.png"
          sizes="192x192"
        ></link>
        <link
          rel="apple-touch-icon"
          href="https://tenhil.de/wp-content/uploads/2022/05/cropped-favicon-1-180x180.png"
        ></link>
      </Head>
      <Container
        maxWidth="lg"
        sx={{
          p: 3,
        }}
      >
        <NavBar />
        <Box mt={3}>{children}</Box>
      </Container>
    </>
  );
}
