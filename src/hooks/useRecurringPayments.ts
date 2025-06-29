import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface RecurringPayment {
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
  category?: {
    name: string;
    icon: string;
    color: string;
  };
}

export function useRecurringPayments() {
  const { user } = useAuth();
  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchRecurringPayments();
    }
  }, [user]);

  const fetchRecurringPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recurring_payments')
        .select(`
          *,
          category:categories(name, icon, color)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecurringPayments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addRecurringPayment = async (payment: Omit<RecurringPayment, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('recurring_payments')
        .insert([{ ...payment, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      await fetchRecurringPayments();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updateRecurringPayment = async (id: string, updates: Partial<RecurringPayment>) => {
    try {
      const { data, error } = await supabase
        .from('recurring_payments')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      await fetchRecurringPayments();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const deleteRecurringPayment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recurring_payments')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      await fetchRecurringPayments();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const togglePaymentStatus = async (id: string, isActive: boolean) => {
    return updateRecurringPayment(id, { is_active: isActive });
  };

  return {
    recurringPayments,
    loading,
    error,
    addRecurringPayment,
    updateRecurringPayment,
    deleteRecurringPayment,
    togglePaymentStatus,
    refetch: fetchRecurringPayments,
  };
}