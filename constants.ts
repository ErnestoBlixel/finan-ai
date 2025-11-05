
import { Category, Transaction } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { name: 'Groceries', color: '#4ade80' },
  { name: 'Utilities', color: '#facc15' },
  { name: 'Transport', color: '#60a5fa' },
  { name: 'Restaurants', color: '#f87171' },
  { name: 'Shopping', color: '#c084fc' },
  { name: 'Health', color: '#2dd4bf' },
  { name: 'Entertainment', color: '#fb923c' },
  { name: 'Income', color: '#34d399' },
  { name: 'Rent', color: '#a78bfa' },
  { name: 'Uncategorized', color: '#9ca3af' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: '1', date: '2023-10-01', description: 'Monthly Salary', amount: 3500, category: 'Income', type: 'income' },
    { id: '2', date: '2023-10-01', description: 'Apartment Rent', amount: 1200, category: 'Rent', type: 'expense' },
    { id: '3', date: '2023-10-03', description: 'Supermarket', amount: 85.50, category: 'Groceries', type: 'expense' },
    { id: '4', date: '2023-10-05', description: 'Electricity Bill', amount: 65.00, category: 'Utilities', type: 'expense' },
    { id: '5', date: '2023-10-07', description: 'Gas Station', amount: 45.00, category: 'Transport', type: 'expense' },
    { id: '6', date: '2023-10-10', description: 'Dinner with friends', amount: 55.20, category: 'Restaurants', type: 'expense' },
    { id: '7', date: '2023-10-12', description: 'Cinema Tickets', amount: 24.00, category: 'Entertainment', type: 'expense' },
    { id: '8', date: '2023-10-15', description: 'Clothing Store', amount: 120.00, category: 'Shopping', type: 'expense' },
    { id: '9', date: '2023-10-18', description: 'Pharmacy', amount: 30.75, category: 'Health', type: 'expense' },
    { id: '10', date: '2023-10-20', description: 'Weekly Groceries', amount: 75.30, category: 'Groceries', type: 'expense' },
    { id: '11', date: '2023-10-25', description: 'Internet Bill', amount: 50.00, category: 'Utilities', type: 'expense' },
    { id: '12', date: '2023-10-28', description: 'Freelance Project', amount: 500, category: 'Income', type: 'income' },
];
