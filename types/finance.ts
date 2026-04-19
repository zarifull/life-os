export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
  created_at: string;
}

export const FINANCE_CATEGORIES = [
  "Food", 
  "Transport", 
  "University", 
  "Tech", 
  "Freelance", 
  "Shopping", 
  "Other"
] as const;

export type FinanceCategory = typeof FINANCE_CATEGORIES[number];