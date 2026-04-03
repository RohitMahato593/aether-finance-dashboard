export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  type: TransactionType;
  method: string;
  notes?: string;
}

export interface DailyData {
  date: string;
  income: number;
  expense: number;
  savings: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export type Theme = 'light' | 'dark';

export interface DashboardState {
  transactions: Transaction[];
  theme: Theme;
  currency: string;
  dateRange: 7 | 30 | 60;
}
