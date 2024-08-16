import React from 'react';
import { getSession } from 'next-auth/react';
import Typography from '@mui/material/Typography';
import { Layout } from '@/components/Layout';
import { GetServerSidePropsContext } from 'next';
import Button from '@mui/material/Button';
import Snackbar, { SnackbarProps } from '@mui/joy/Snackbar';
import { TransactionsDataGrid } from '@/components/TransactionsDataGrid';
import { TransactionAddEditDialog } from '@/components/TransactionAddEditDialog';
import { TransactionDeleteDialog } from '@/components/TransactionDeleteDialog';
import { DbTransaction } from '@/db';

const defaultToastProperties: SnackbarProps = {
  open: false,
};

export default function Transactions() {
  const [isTransactionAddEditDialogOpen, setIsTransactionAddEditDialogOpen] = React.useState(false);
  const [transactionEditData, setTransactionEditData] = React.useState<DbTransaction | null>(null);
  const [transactionDeleteData, setTransactionDeleteData] = React.useState<DbTransaction | null>(null);
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastProperties, setToastProperties] = React.useState<SnackbarProps>(defaultToastProperties);

  const showTransactionAddedToast = () => {
    setToastMessage('Your transaction has been added');
    setToastProperties({
      open: true,
    });
  };

  const showTransactionEditedToast = () => {
    setToastMessage('Your transaction has been edited');
    setToastProperties({
      open: true,
    });
  };

  const showTransactionDeletedToast = () => {
    setToastMessage('Your transaction has been deleted');
    setToastProperties({
      open: true,
    });
  };

  return (
    <Layout pageName="Transactions">
      <Typography
        variant="h1"
        sx={{
          fontSize: 18,
          fontWeight: 'bold',
          mb: 2,
        }}
      >
        Transactions page content
      </Typography>

      <Button variant="contained" onClick={() => setIsTransactionAddEditDialogOpen(true)}>
        Add a transaction
      </Button>

      <TransactionsDataGrid
        onClickEditTransaction={(transaction: DbTransaction) => {
          setTransactionEditData(transaction);
          setIsTransactionAddEditDialogOpen(true);
        }}
        onClickDeleteTransaction={(transaction: DbTransaction) => setTransactionDeleteData(transaction)}
      />

      <TransactionAddEditDialog
        isOpen={isTransactionAddEditDialogOpen}
        onClose={() => {
          setIsTransactionAddEditDialogOpen(false);
          setTimeout(() => setTransactionEditData(null), 500);
        }}
        onSuccess={() => {
          if (transactionEditData) {
            showTransactionEditedToast();
          } else {
            showTransactionAddedToast();
          }
        }}
        transaction={transactionEditData}
      />

      <TransactionDeleteDialog
        isOpen={!!transactionDeleteData}
        onClose={() => setTransactionDeleteData(null)}
        onSuccess={showTransactionDeletedToast}
        transaction={transactionDeleteData}
      />

      <Snackbar
        onClose={() => setToastProperties(defaultToastProperties)}
        autoHideDuration={2000}
        color="success"
        size="md"
        variant="solid"
        {...toastProperties}
      >
        {toastMessage}
      </Snackbar>
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
