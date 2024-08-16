import { DbTransaction } from './db/tables/transactions';
export enum TransactionType {
  Income = 'income',
  Expense = 'expense',
}

export enum TransactionCategory {
  Groceries = 'groceries',
  Salary = 'salary',
  Rent = 'rent',
  Savings = 'savings',
  Investments = 'investments',
  Other = 'other',
}

export type Transaction = {
  type: TransactionType;
  amount: number;
  date: number;
  category: TransactionCategory;
  description?: string;
};
