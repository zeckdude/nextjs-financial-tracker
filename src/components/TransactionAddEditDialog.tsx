import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EuroIcon from '@mui/icons-material/Euro';
import { InputAdornment, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { TransactionCategory, TransactionType, Transaction } from '@/types';
import { saveTransaction } from '@/db/utils';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { validateCurrencyAmount, formatCurrencyAmount } from '@/helpers/currency';
import { DbTransaction } from '@/db';

type FormTransaction = {
  type: TransactionType | null;
  amount: number | null;
  date: Dayjs | null;
  category: TransactionCategory | null;
  description?: string;
};

type TransactionAddEditDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction: DbTransaction | null;
};

const isCompleteTransaction = (data: FormTransaction): data is FormTransaction => {
  const requiredFields: (keyof FormTransaction)[] = ['type', 'amount', 'date', 'category'];
  return requiredFields.every((field) => data[field] !== null);
};

export function TransactionAddEditDialog({
  isOpen,
  onClose,
  onSuccess,
  transaction,
  ...props
}: TransactionAddEditDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormTransaction>({
    defaultValues: {
      type: null,
      amount: null,
      date: null,
      category: null,
      description: '',
    },
  });

  console.log('transaction in TransactionAddEditDialog', transaction);

  useEffect(() => {
    if (transaction) {
      console.log('Resetting with transaction data');

      reset(
        {
          type: transaction.type,
          amount: transaction.amount,
          date: dayjs.unix(transaction.date),
          category: transaction.category,
          description: transaction.description,
        },
        {
          keepDefaultValues: true,
        }
      );
    }
  }, [transaction, reset]);

  const handleTransactionSubmit: SubmitHandler<FormTransaction> = async (data) => {
    console.log('data', data);

    if (isCompleteTransaction(data)) {
      await saveTransaction({
        ...data,
        date: dayjs(data.date).unix(),
        id: transaction?.id ?? undefined,
      } as DbTransaction);

      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit(handleTransactionSubmit),
      }}
      sx={{ mt: 3 }}
      TransitionProps={{
        onExited: () => {
          reset();
        },
      }}
      {...props}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DialogTitle>{transaction ? 'Edit' : 'Add'} a transaction</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {transaction ? 'Edit' : 'Add'} the required information and click Confirm
          </DialogContentText>
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
                {Object.entries(TransactionType).map(([transactionKey, transactionValue]) => (
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
            rules={{
              required: 'Set the transaction amount',
              validate: validateCurrencyAmount,
            }}
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
                      <EuroIcon color={!!errors.amount?.message ? 'error' : 'inherit'} />
                    </InputAdornment>
                  ),
                }}
                {...field}
                onBlur={() => {
                  const value = field.value ? parseFloat(field.value.toString()) : 0;
                  field.onChange(formatCurrencyAmount(value));
                }}
              />
            )}
          />
          <Controller
            name="date"
            control={control}
            rules={{ required: 'Set the transaction date' }}
            render={({ field }) => (
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
                helperText={errors.category?.message ?? 'What category transaction was it?'}
                error={!!errors.category?.message}
                sx={{ mt: 2 }}
                {...field}
              >
                {Object.entries(TransactionCategory).map(([categoryKey, categoryValue]) => (
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
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={!isDirty}>
            Confirm
          </Button>
        </DialogActions>
      </LocalizationProvider>
    </Dialog>
  );
}
