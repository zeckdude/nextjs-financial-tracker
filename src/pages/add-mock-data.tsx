import Typography from '@mui/material/Typography';
import { Layout } from '@/components/Layout';
import { useEffect } from 'react';
import { addMockData } from '@/db/utils';

export default function AddMockDataPage() {
  useEffect(() => {
    addMockData({
      monthsToGenerate: 36,
    });
  }, []);

  return (
    <Layout pageName="Add Mock Data">
      <Typography>Check the console for the mock data that was added to the indexedDB database.</Typography>
    </Layout>
  );
}
