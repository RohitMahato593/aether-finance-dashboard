import { subDays, format, startOfDay } from 'date-fns';
import { DailyData, Transaction, CategoryData } from './types';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investments'];
const EXPENSE_CATEGORIES = ['Food', 'Rent', 'Travel', 'Shopping', 'Entertainment', 'Health'];

export const generateMockData = (days: number = 60) => {
  const dailyData: DailyData[] = [];
  const transactions: Transaction[] = [];

  for (let i = days; i >= 0; i--) {
    const date = startOfDay(subDays(new Date(), i));
    const dateStr = format(date, 'yyyy-MM-dd');

    // Generate daily totals
    const income = Math.random() > 0.3 ? Math.floor(Math.random() * 500) + 200 : 0;
    const expense = Math.floor(Math.random() * 400) + 100;
    
    dailyData.push({
      date: dateStr,
      income,
      expense,
      savings: income - expense,
    });

    // Generate individual transactions
    if (income > 0) {
      transactions.push({
        id: `inc-${i}`,
        amount: income,
        category: INCOME_CATEGORIES[Math.floor(Math.random() * INCOME_CATEGORIES.length)],
        date: dateStr,
        type: 'income',
        method: 'Bank Transfer',
      });
    }

    transactions.push({
      id: `exp-${i}`,
      amount: expense,
      category: EXPENSE_CATEGORIES[Math.floor(Math.random() * EXPENSE_CATEGORIES.length)],
      date: dateStr,
      type: 'expense',
      method: 'Credit Card',
    });
  }

  return { dailyData, transactions };
};

export const getCategoryBreakdown = (transactions: Transaction[]): CategoryData[] => {
  const breakdown: Record<string, number> = {};
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  transactions.filter(t => t.type === 'expense').forEach(t => {
    breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
  });

  return Object.entries(breakdown).map(([name, value], i) => ({
    name,
    value,
    color: colors[i % colors.length],
  }));
};

export const getIncomeSources = (transactions: Transaction[]): CategoryData[] => {
  const breakdown: Record<string, number> = {};
  const colors = ['#059669', '#2563eb', '#d97706', '#7c3aed'];

  transactions.filter(t => t.type === 'income').forEach(t => {
    breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
  });

  return Object.entries(breakdown).map(([name, value], i) => ({
    name,
    value,
    color: colors[i % colors.length],
  }));
};
