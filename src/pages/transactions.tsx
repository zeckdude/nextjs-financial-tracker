import React from 'react';
import { getSession, GetSessionParams } from 'next-auth/react';
import Typography from '@mui/material/Typography';
import { Layout } from '@/components/Layout';
import { GetServerSidePropsContext } from 'next';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EuroIcon from '@mui/icons-material/Euro';
import { FormControl, FormHelperText, InputAdornment, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

enum Transaction {
  Income = 'income',
  Expense = 'expense',
}

enum Category {
  Groceries = 'groceries',
  Salary = 'salary',
  Rent = 'rent',
  Savings = 'savings',
  Investments = 'investments',
  Other = 'other',
}

type FormInputs = {
  type: Transaction | null;
  amount: number | null;
  date: string | null;
  category: Category | null;
  description: string;
};

export default function Transactions() {
  const [isRecordingDialogOpen, setIRecordingDialogOpen] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: null,
      amount: null,
      date: null,
      category: null,
      description: '',
    },
  });

  console.log('errors', errors);

  const handleClickOpen = () => {
    setIRecordingDialogOpen(true);
  };

  const handleClose = () => {
    setIRecordingDialogOpen(false);
  };

  const handleTransactionSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log('data', data);
  };

  return (
    <Layout pageName="Transactions">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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

        <Button variant="contained" onClick={handleClickOpen}>
          Record a transaction
        </Button>
        <Dialog
          open={isRecordingDialogOpen}
          onClose={handleClose}
          PaperProps={{
            component: 'form',
            onSubmit: handleSubmit(handleTransactionSubmit),
          }}
        >
          <DialogTitle>Record a transaction</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>Add the required information and click Confirm</DialogContentText>
            <Controller
              name="type"
              control={control}
              rules={{ required: 'Set the transaction type' }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  select
                  label="Type"
                  helperText={errors.type?.message ?? 'What type of transaction was it?'}
                  error={!!errors.type?.message}
                  {...field}
                >
                  {Object.entries(Transaction).map(([transactionKey, transactionValue]) => (
                    <MenuItem key={transactionKey} value={transactionValue}>
                      {transactionKey}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="amount"
              control={control}
              rules={{ required: 'Set the transaction amount' }}
              render={({ field }) => (
                <TextField
                  autoFocus
                  margin="dense"
                  label="Amount"
                  type="number"
                  variant="outlined"
                  fullWidth
                  helperText={errors.amount?.message ?? 'How much was it?'}
                  error={!!errors.amount?.message}
                  sx={{ mt: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EuroIcon />
                      </InputAdornment>
                    ),
                  }}
                  {...field}
                />
              )}
            />
            <Controller
              name="date"
              control={control}
              rules={{ required: 'Set the transaction date' }}
              render={({ field }) => (
                <FormControl>
                  <DatePicker
                    formatDensity="dense"
                    format="DD-MM-YYYY"
                    sx={{ mt: 1 }}
                    disableFuture
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        error: !!errors.date?.message,
                        helperText: errors.date?.message ?? 'On which date was the transaction?',
                      },
                    }}
                    {...field}
                  />
                </FormControl>
              )}
            />
            <Controller
              name="category"
              control={control}
              rules={{ required: 'Set the transaction category' }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  select
                  label="Category"
                  defaultValue={Category.Groceries}
                  helperText={errors.category?.message ?? 'What category transaction was it?'}
                  error={!!errors.category?.message}
                  sx={{ mt: 2 }}
                  {...field}
                >
                  {Object.entries(Category).map(([categoryKey, categoryValue]) => (
                    <MenuItem key={categoryKey} value={categoryValue}>
                      {categoryKey}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  helperText="Any notes to add?"
                  sx={{ mt: 2 }}
                  {...field}
                />
              )}
            />
          </DialogContent>
          <DialogActions sx={{ mr: 2, mb: 2 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
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
