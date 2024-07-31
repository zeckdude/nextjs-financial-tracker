/** @jsxImportSource @emotion/react */
import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import Button from '@mui/material/Button';
import { css } from '@emotion/react';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import LoadingButton from '@mui/lab/LoadingButton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { NavBar } from '@/components/NavBar';
import { Box } from '@mui/material';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const { data, status } = useSession();

  return (
    <>
      <Head>
        <title>Tenhil Coding Challenge</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="lg">
        <NavBar
          sx={{
            mt: 3,
          }}
        />

        <Box mt={3}>
          {status === 'authenticated' ? (
            <Typography>Authenticated content</Typography>
          ) : (
            <Typography>Home page content (Click Login in navbar)</Typography>
          )}
        </Box>
      </Container>
    </>
  );
}
