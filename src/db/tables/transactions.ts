import { Transaction } from '@/types';
import { Table } from 'dexie';

export type DbTransaction = Transaction & {
  id?: number;
};

export type DbTransactionsTable = {
  transactions: Table<DbTransaction>;
};

export const transactionsSchema = {
  transactions: '++id, type, amount, date, category, description',
};
