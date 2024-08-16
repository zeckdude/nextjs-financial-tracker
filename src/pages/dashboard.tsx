import { getSession, GetSessionParams } from 'next-auth/react';
import Typography from '@mui/material/Typography';
import { Layout } from '@/components/Layout';
import { GetServerSidePropsContext } from 'next';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { useMemo, useState } from 'react';
import Decimal from 'decimal.js';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { ApexOptions } from 'apexcharts';
import { Box, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import dayjs from 'dayjs';

export default function Dashboard() {
  const [monthToDisplay, setMonthToDisplay] = useState<number>(new Date().getMonth());
  const [yearToDisplay, setYearToDisplay] = useState<number>(new Date().getFullYear());

  // const dateToDisplay = useMemo(() => new Date(yearToDisplay, monthToDisplay), [monthToDisplay, yearToDisplay]);
  // const monthYearString = useMemo(() => {
  //   return dateToDisplay.toLocaleString('default', { month: 'long', year: 'numeric' });
  // }, [dateToDisplay]);

  const dateToDisplay = useMemo(() => new Date(yearToDisplay, monthToDisplay), [monthToDisplay, yearToDisplay]);
  const monthYearString = useMemo(() => {
    return dayjs(dateToDisplay).format('MMMM YYYY');
  }, [dateToDisplay]);

  const transactions = useLiveQuery(
    () =>
      db.transactions
        .filter((transaction) => {
          const date = new Date(transaction.date * 1000); // Convert UNIX timestamp to JavaScript Date object
          const transactionMonth = date.getMonth(); // Get the month (0-11)
          const transactionYear = date.getFullYear(); // Get the year

          const targetMonth = monthToDisplay; // Replace with the target month (0 = January, 11 = December)
          const targetYear = yearToDisplay; // Replace with the target year

          return transactionMonth === targetMonth && transactionYear === targetYear;
        })
        .toArray(),
    [monthToDisplay, yearToDisplay]
  );

  console.log('transactions in Dashboard', transactions);

  const transactionsTotal = useMemo(() => {
    return !transactions?.length
      ? {
          income: 0,
          expenses: 0,
          netSavings: 0,
        }
      : transactions.reduce(
          (acc, transaction) => {
            if (transaction.type === 'income') {
              acc.income = new Decimal(acc.income).plus(transaction.amount).toNumber();
            } else {
              acc.expenses = new Decimal(acc.expenses).plus(transaction.amount).toNumber();
            }

            acc.netSavings = new Decimal(acc.income).minus(acc.expenses).toNumber();

            return acc;
          },
          {
            income: 0,
            expenses: 0,
            netSavings: 0,
          }
        );
  }, [transactions]);

  console.log('transactionsTotal in Dashboard', transactionsTotal);

  const chartConfig = useMemo(
    () => ({
      options: {
        chart: {
          type: 'bar',
          id: 'basic-bar',
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            barHeight: '100%',
            distributed: true,
            horizontal: false,
            dataLabels: {
              position: 'top',
            },
          },
        },
        dataLabels: {
          enabled: true,
          style: {
            colors: ['#fff'],
          },
          formatter: function (val: number) {
            return `$${val}`;
          },
        },
        xaxis: {
          categories: ['Income', 'Expenses', 'Net Savings'],
        },
        yaxis: {
          labels: {
            show: false,
          },
        },
        tooltip: {
          theme: 'dark',
          x: {
            show: true,
          },
          y: {
            formatter: function (val: number) {
              return `$${val.toFixed(2)}`;
            },
            title: {
              formatter: function () {
                return null;
              },
            },
          },
          marker: {
            show: false,
          },
        },
      },
      series: [
        {
          name: 'Income',
          data: [transactionsTotal.income, transactionsTotal.expenses, transactionsTotal.netSavings],
        },
      ],
    }),
    [transactionsTotal]
  );

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
      <Box display="flex" alignItems="center" justifyContent="center" gap="20px" mb={2}>
        <IconButton
          onClick={() => {
            if (monthToDisplay === 0) {
              setMonthToDisplay(11);
              setYearToDisplay(yearToDisplay - 1);
            } else {
              setMonthToDisplay(monthToDisplay - 1);
            }
          }}
          aria-label="last month"
        >
          <ChevronLeftIcon />
        </IconButton>
        <Typography
          variant="h4"
          sx={{
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          {monthYearString}
        </Typography>
        <IconButton
          onClick={() => {
            if (monthToDisplay === 11) {
              setMonthToDisplay(0);
              setYearToDisplay(yearToDisplay + 1);
            } else {
              setMonthToDisplay(monthToDisplay + 1);
            }
          }}
          aria-label="next month"
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
      {typeof window !== 'undefined' && (
        <Chart options={chartConfig.options} series={chartConfig.series} type="bar" width="100%" />
      )}
      <Typography>Total Income: ${transactionsTotal.income.toFixed(2)}</Typography>
      <Typography>Total Expenses: ${transactionsTotal.expenses.toFixed(2)}</Typography>
      <Typography>Net Savings for this month: ${transactionsTotal.netSavings.toFixed(2)}</Typography>
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
