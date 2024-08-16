import { db, DbTransaction } from '@/db';
import { Transaction, TransactionCategory, TransactionType } from '@/types';
import { faker } from '@faker-js/faker';

export const saveTransaction = async (transaction: DbTransaction) => {
  await db.transactions.put(transaction);
};

export const deleteTransaction = async (transaction: DbTransaction) => {
  await db.transactions.delete(transaction.id);
};

// Utility function to get a random value from an array
const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Function to generate a random date within the last 12 months, or for a specific month
const generateRandomDateForMonth = (month: number, year: number): number => {
  const start = new Date(year, month, 1).getTime();
  const end = new Date(year, month + 1, 0).getTime(); // Last day of the month
  const randomDate = new Date(start + Math.random() * (end - start));
  return Math.floor(randomDate.getTime() / 1000); // Return as UNIX timestamp in seconds
};

// Function to generate a random transaction with a fake description
const generateRandomTransaction = (month: number, year: number): Transaction => {
  const randomAmount = (Math.random() * 1500).toFixed(2); // Random amount between 0 and 1500
  const randomDate = generateRandomDateForMonth(month, year); // Random date for the specified month and year
  const randomType = getRandomElement(Object.values(TransactionType));
  const randomCategory = getRandomElement(Object.values(TransactionCategory));

  // Generate a more authentic description using faker
  let description: string;
  if (randomType === TransactionType.Income) {
    description = faker.finance.transactionDescription();
  } else {
    description = faker.commerce.productDescription();
  }

  return {
    type: randomType,
    amount: parseFloat(randomAmount),
    date: randomDate,
    category: randomCategory,
    description,
  };
};

// Function to add mock data to Dexie with the specified conditions
export const addMockData = async () => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const mockTransactions: Transaction[] = [];
  const transactionsByMonthYear: { [key: string]: Transaction[] } = {};

  // Ensure at least 3 transactions for the current month
  for (let i = 0; i < 3; i++) {
    const transaction = generateRandomTransaction(currentMonth, currentYear);
    mockTransactions.push(transaction);
    const key = `${currentYear}-${currentMonth}`;
    if (!transactionsByMonthYear[key]) transactionsByMonthYear[key] = [];
    transactionsByMonthYear[key].push(transaction);
  }

  // Generate transactions for the last 12 months
  for (let i = 0; i < 12; i++) {
    const month = (currentMonth - i + 12) % 12;
    const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
    const key = `${year}-${month}`;

    if (!transactionsByMonthYear[key]) transactionsByMonthYear[key] = [];

    let incomeTotal = 0;
    let expenseTotal = 0;

    // Generate at least 2 income and 2 expense transactions for each month
    for (let j = 0; j < 4; j++) {
      const transaction = generateRandomTransaction(month, year);
      if (transaction.type === TransactionType.Income) {
        incomeTotal += transaction.amount;
      } else {
        expenseTotal += transaction.amount;
      }
      mockTransactions.push(transaction);
      transactionsByMonthYear[key].push(transaction);
    }

    // Adjust income/expense balance
    const targetBalance = Math.random() > 0.5 ? incomeTotal + 500 : expenseTotal + 500;
    const balanceDifference = targetBalance - Math.abs(incomeTotal - expenseTotal);
    const adjustmentTransaction = generateRandomTransaction(month, year);

    if (incomeTotal < expenseTotal) {
      adjustmentTransaction.type = TransactionType.Income;
    } else {
      adjustmentTransaction.type = TransactionType.Expense;
    }

    adjustmentTransaction.amount = parseFloat(Math.min(Math.abs(balanceDifference), 1500).toFixed(2));
    mockTransactions.push(adjustmentTransaction);
    transactionsByMonthYear[key].push(adjustmentTransaction);
  }

  await db.transactions.bulkAdd(mockTransactions);

  // Log the transactions grouped by month and year with totals
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  console.log('Mock data added:');
  Object.keys(transactionsByMonthYear).forEach((key) => {
    const [year, monthIndex] = key.split('-').map(Number);
    const month = monthNames[monthIndex];
    const transactions = transactionsByMonthYear[key];
    const totalTransactions = transactions.length;

    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === TransactionType.Income) {
        incomeTotal += transaction.amount;
      } else {
        expenseTotal += transaction.amount;
      }
    });

    console.log(`\n${month} ${year} (${totalTransactions} transactions):`);
    console.log(`Total Income: $${incomeTotal.toFixed(2)}`);
    console.log(`Total Expenses: $${expenseTotal.toFixed(2)}`);
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date * 1000);
      console.log(
        `- ${transaction.type} of $${transaction.amount.toFixed(2)} on ${date.toDateString()}: ${
          transaction.description
        }`
      );
    });
  });
};
