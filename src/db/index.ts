import BaseDexie from 'dexie';

import { transactionsSchema, DbTransactionsTable, DbTransaction } from './tables/transactions';

type DexieTables = DbTransactionsTable;
export type Dexie<T extends any = DexieTables> = BaseDexie & T;

export const db = new BaseDexie('nextjs-financial-tracker') as Dexie;
const schema = {
  ...transactionsSchema,
};
db.version(1).stores(schema);

export type { DbTransaction };
