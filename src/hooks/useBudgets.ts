import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface Budget {
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
  category?: {
    name: string;
    icon: string;
    color: string;
  };
}

export interface BudgetSummary {
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
}

export function useBudgets() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetSummaries, setBudgetSummaries] = useState<BudgetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchBudgets();
      fetchBudgetSummaries();
    }
  }, [user]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('budgets')
        .select(`
          *,
          category:categories(name, icon, color)
        `)
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBudgets(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetSummaries = async () => {
    try {
      const { data, error } = await supabase
        .from('budget_summary')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setBudgetSummaries(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const addBudget = async (budget: Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert([{ ...budget, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      await fetchBudgets();
      await fetchBudgetSummaries();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      await fetchBudgets();
      await fetchBudgetSummaries();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      await fetchBudgets();
      await fetchBudgetSummaries();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  return {
    budgets,
    budgetSummaries,
    loading,
    error,
    addBudget,
    updateBudget,
    deleteBudget,
    refetch: () => {
      fetchBudgets();
      fetchBudgetSummaries();
    },
  };
}