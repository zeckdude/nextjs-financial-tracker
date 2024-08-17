import React from 'react';
import { Box, Typography } from '@mui/material';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, DbTransaction } from '@/db';
import { DataGrid, GridRowsProp, GridColDef, GridActionsCellItem, GridRowId, GridRowEntry } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import capitalize from 'lodash.capitalize';
import dayjs from 'dayjs';

function CustomNoRowsOverlay() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Typography variant="body2">No transactions found</Typography>
    </Box>
  );
}

type TransactionsDataGridProps = {
  onClickEditTransaction: (transaction: DbTransaction) => void;
  onClickDeleteTransaction: (transaction: DbTransaction) => void;
};

export function TransactionsDataGrid({ onClickEditTransaction, onClickDeleteTransaction }: TransactionsDataGridProps) {
  const transactions = useLiveQuery(() => db.transactions.toArray(), []);

  const columns: GridColDef[] = [
    {
      field: 'type',
      headerName: 'Type',
      flex: 0,
      minWidth: 100,
      renderCell: (params) => capitalize(params.value),
    },
    {
      field: 'amount',
      type: 'number',
      headerName: 'Amount',
      headerAlign: 'left',
      flex: 0,
      minWidth: 100,
      renderCell: (params) => `€${params.value}`,
      align: 'left',
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 0,
      minWidth: 150,
      renderCell: (params) => dayjs.unix(params.value).format('DD/MM/YYYY'),
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 0,
      minWidth: 150,
      renderCell: (params) => capitalize(params.value),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      renderCell: (params) => (params.value === '' ? <i>N/A</i> : params.value),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 0,
      minWidth: 100,
      cellClassName: 'actions',
      getActions: ({ row }) => {
        return [
          <GridActionsCellItem
            key={row.id}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => onClickEditTransaction(row)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={row.id}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => onClickDeleteTransaction(row)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const rows: GridRowsProp =
    transactions?.map((transaction) => ({
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date,
      category: transaction.category,
      description: transaction.description,
    })) ?? [];

  return (
    <Box sx={{ mt: 3 }}>
      <DataGrid
        density="compact"
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        autoHeight
        sx={{
          '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
            outline: 'none !important',
          },
          '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within': { outline: 'none' },
        }}
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
          noResultsOverlay: CustomNoRowsOverlay,
        }}
      />
    </Box>
  );
}
