import { useSession } from 'next-auth/react';
import Typography from '@mui/material/Typography';
import { Layout } from '@/components/Layout';

export default function Home() {
  const { status } = useSession();

  return (
    <Layout pageName="Home">
      <Typography>
        Home page content {status !== 'authenticated' && status !== 'loading' && '(Click Login in navbar)'}
      </Typography>
    </Layout>
  );
}
