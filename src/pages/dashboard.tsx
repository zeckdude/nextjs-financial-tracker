import { getSession, GetSessionParams } from 'next-auth/react';
import Typography from '@mui/material/Typography';
import { Layout } from '@/components/Layout';
import { GetServerSidePropsContext } from 'next';

export default function Dashboard() {
  return (
    <Layout pageName="Dashboard">
      <Typography
        variant="h1"
        sx={{
          fontSize: 18,
          fontWeight: 'bold',
          mb: 2,
        }}
      >
        Dashboard page content
      </Typography>
      <Typography>Total Income: $444</Typography>
      <Typography>Total Expenses: $444</Typography>
      <Typography>Net Savings for this month: $444</Typography>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
