import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          currency: string;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          currency?: string;
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          currency?: string;
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          icon: string;
          color: string;
          budget_limit: number | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          icon?: string;
          color?: string;
          budget_limit?: number | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          icon?: string;
          color?: string;
          budget_limit?: number | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'checking' | 'savings' | 'credit' | 'investment';
          balance: number;
          currency: string;
          is_connected: boolean;
          last_sync: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type?: 'checking' | 'savings' | 'credit' | 'investment';
          balance?: number;
          currency?: string;
          is_connected?: boolean;
          last_sync?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: 'checking' | 'savings' | 'credit' | 'investment';
          balance?: number;
          currency?: string;
          is_connected?: boolean;
          last_sync?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          account_id: string | null;
          category_id: string;
          amount: number;
          description: string;
          transaction_date: string;
          type: 'income' | 'expense';
          tags: string[] | null;
          receipt_url: string | null;
          is_recurring: boolean;
          recurring_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id?: string | null;
          category_id: string;
          amount: number;
          description: string;
          transaction_date?: string;
          type: 'income' | 'expense';
          tags?: string[] | null;
          receipt_url?: string | null;
          is_recurring?: boolean;
          recurring_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string | null;
          category_id?: string;
          amount?: number;
          description?: string;
          transaction_date?: string;
          type?: 'income' | 'expense';
          tags?: string[] | null;
          receipt_url?: string | null;
          is_recurring?: boolean;
          recurring_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          allocated_amount: number;
          period_type: 'weekly' | 'monthly' | 'yearly';
          period_start: string;
          period_end: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          allocated_amount: number;
          period_type?: 'weekly' | 'monthly' | 'yearly';
          period_start: string;
          period_end: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string;
          allocated_amount?: number;
          period_type?: 'weekly' | 'monthly' | 'yearly';
          period_start?: string;
          period_end?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      recurring_payments: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          account_id: string | null;
          name: string;
          amount: number;
          frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
          next_payment_date: string;
          last_payment_date: string | null;
          is_active: boolean;
          icon: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          account_id?: string | null;
          name: string;
          amount: number;
          frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
          next_payment_date: string;
          last_payment_date?: string | null;
          is_active?: boolean;
          icon?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string;
          account_id?: string | null;
          name?: string;
          amount?: number;
          frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
          next_payment_date?: string;
          last_payment_date?: string | null;
          is_active?: boolean;
          icon?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      uploaded_documents: {
        Row: {
          id: string;
          user_id: string;
          transaction_id: string | null;
          file_name: string;
          file_url: string;
          file_type: string;
          file_size: number;
          processing_status: 'pending' | 'processing' | 'processed' | 'error';
          extracted_data: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          transaction_id?: string | null;
          file_name: string;
          file_url: string;
          file_type: string;
          file_size: number;
          processing_status?: 'pending' | 'processing' | 'processed' | 'error';
          extracted_data?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          transaction_id?: string | null;
          file_name?: string;
          file_url?: string;
          file_type?: string;
          file_size?: number;
          processing_status?: 'pending' | 'processing' | 'processed' | 'error';
          extracted_data?: any | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      budget_summary: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          category_name: string;
          category_icon: string;
          category_color: string;
          allocated_amount: number;
          period_type: string;
          period_start: string;
          period_end: string;
          spent_amount: number;
          remaining_amount: number;
          utilization_percentage: number;
          transaction_count: number;
        };
      };
      monthly_summary: {
        Row: {
          user_id: string;
          month: string;
          total_income: number;
          total_expenses: number;
          net_amount: number;
          income_count: number;
          expense_count: number;
          total_transactions: number;
        };
      };
      category_spending: {
        Row: {
          user_id: string;
          category_id: string;
          category_name: string;
          category_icon: string;
          category_color: string;
          month: string;
          total_spent: number;
          transaction_count: number;
          average_amount: number;
        };
      };
    };
    Functions: {
      get_budget_status: {
        Args: {
          user_uuid: string;
          period_start_date?: string;
        };
        Returns: {
          category_name: string;
          allocated: number;
          spent: number;
          remaining: number;
          percentage: number;
        }[];
      };
      get_monthly_stats: {
        Args: {
          user_uuid: string;
          target_month?: string;
        };
        Returns: {
          income: number;
          expenses: number;
          net: number;
          transaction_count: number;
          avg_daily_expense: number;
        }[];
      };
    };
  };
}