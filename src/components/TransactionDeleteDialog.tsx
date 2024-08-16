import React, { FormEvent } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DbTransaction } from '@/db';
import { deleteTransaction } from '@/db/utils';
import capitalize from 'lodash.capitalize';
import dayjs from 'dayjs';
import { Box } from '@mui/material';

type TransactionDeleteDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction: DbTransaction | null;
};

export function TransactionDeleteDialog({
  isOpen,
  onClose,
  onSuccess,
  transaction,
  ...props
}: TransactionDeleteDialogProps) {
  if (!transaction) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          deleteTransaction(transaction);
          onSuccess();
          onClose();
        },
      }}
      sx={{ mt: 3 }}
      {...props}
    >
      <DialogTitle>Delete a transaction</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>Are you sure you want to delete the following transaction?</DialogContentText>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
          <div>
            <strong>Type: </strong>
            {capitalize(transaction.type)}
          </div>
          <div>
            <strong>Amount: </strong>
            {`€${transaction.amount}`}
          </div>
          <div>
            <strong>Date: </strong>
            {dayjs.unix(transaction.date).format('DD/MM/YYYY')}
          </div>
          <div>
            <strong>Category: </strong>
            {capitalize(transaction.category)}
          </div>
          <div>
            <strong>Description: </strong>
            {transaction.description === '' ? <i>N/A</i> : transaction.description}
          </div>
        </Box>
      </DialogContent>
      <DialogActions sx={{ mr: 2, mb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
