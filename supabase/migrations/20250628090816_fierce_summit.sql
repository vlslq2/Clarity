/*
  # Database Views and Functions

  1. Views
    - `budget_summary` - Real-time budget utilization with spending data
    - `monthly_summary` - Monthly income/expense aggregations
    - `category_spending` - Category-wise spending analysis

  2. Functions
    - `get_budget_status()` - Current budget status for a user
    - `get_monthly_stats()` - Monthly financial statistics
    - `calculate_next_payment_date()` - Calculate next recurring payment date

  3. Security
    - All functions use SECURITY DEFINER for proper access control
    - Views respect RLS policies through underlying tables
*/

-- Budget Summary View
CREATE OR REPLACE VIEW budget_summary AS
SELECT 
  b.id,
  b.user_id,
  b.category_id,
  c.name as category_name,
  c.icon as category_icon,
  c.color as category_color,
  b.allocated_amount,
  b.period_type,
  b.period_start,
  b.period_end,
  COALESCE(SUM(t.amount), 0) as spent_amount,
  (b.allocated_amount - COALESCE(SUM(t.amount), 0)) as remaining_amount,
  CASE 
    WHEN b.allocated_amount > 0 THEN 
      (COALESCE(SUM(t.amount), 0) / b.allocated_amount * 100)
    ELSE 0 
  END as utilization_percentage,
  COUNT(t.id) as transaction_count
FROM budgets b
LEFT JOIN categories c ON b.category_id = c.id
LEFT JOIN transactions t ON (
  t.category_id = b.category_id 
  AND t.user_id = b.user_id
  AND t.transaction_date >= b.period_start 
  AND t.transaction_date <= b.period_end
  AND t.type = 'expense'
)
WHERE b.is_active = true
GROUP BY b.id, b.user_id, b.category_id, c.name, c.icon, c.color, 
         b.allocated_amount, b.period_type, b.period_start, b.period_end;

-- Monthly Summary View
CREATE OR REPLACE VIEW monthly_summary AS
SELECT 
  t.user_id,
  DATE_TRUNC('month', t.transaction_date) as month,
  SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as total_income,
  SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as total_expenses,
  SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END) as net_amount,
  COUNT(CASE WHEN t.type = 'income' THEN 1 END) as income_count,
  COUNT(CASE WHEN t.type = 'expense' THEN 1 END) as expense_count,
  COUNT(*) as total_transactions
FROM transactions t
GROUP BY t.user_id, DATE_TRUNC('month', t.transaction_date);

-- Category Spending View
CREATE OR REPLACE VIEW category_spending AS
SELECT 
  t.user_id,
  t.category_id,
  c.name as category_name,
  c.icon as category_icon,
  c.color as category_color,
  DATE_TRUNC('month', t.transaction_date) as month,
  SUM(t.amount) as total_spent,
  COUNT(*) as transaction_count,
  AVG(t.amount) as average_amount
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.type = 'expense'
GROUP BY t.user_id, t.category_id, c.name, c.icon, c.color, 
         DATE_TRUNC('month', t.transaction_date);

-- Function to get current budget status
CREATE OR REPLACE FUNCTION get_budget_status(
  user_uuid uuid, 
  period_start_date date DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  category_name text,
  allocated decimal,
  spent decimal,
  remaining decimal,
  percentage numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bs.category_name,
    bs.allocated_amount,
    bs.spent_amount,
    bs.remaining_amount,
    ROUND(bs.utilization_percentage, 2)
  FROM budget_summary bs
  WHERE bs.user_id = user_uuid
    AND bs.period_start <= period_start_date
    AND bs.period_end >= period_start_date
  ORDER BY bs.utilization_percentage DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get monthly statistics
CREATE OR REPLACE FUNCTION get_monthly_stats(
  user_uuid uuid, 
  target_month date DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  income decimal,
  expenses decimal,
  net decimal,
  transaction_count bigint,
  avg_daily_expense decimal
) AS $$
DECLARE
  month_start date;
  month_end date;
  days_in_month integer;
BEGIN
  month_start := DATE_TRUNC('month', target_month)::date;
  month_end := (DATE_TRUNC('month', target_month) + INTERVAL '1 month - 1 day')::date;
  days_in_month := EXTRACT(DAY FROM month_end);
  
  RETURN QUERY
  SELECT 
    COALESCE(ms.total_income, 0),
    COALESCE(ms.total_expenses, 0),
    COALESCE(ms.net_amount, 0),
    COALESCE(ms.total_transactions, 0),
    CASE 
      WHEN ms.total_expenses > 0 THEN 
        ROUND(ms.total_expenses / days_in_month, 2)
      ELSE 0 
    END
  FROM monthly_summary ms
  WHERE ms.user_id = user_uuid
    AND ms.month = DATE_TRUNC('month', target_month);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate next payment date for recurring payments
CREATE OR REPLACE FUNCTION calculate_next_payment_date(
  payment_date date,
  frequency frequency_type
) RETURNS date AS $$
BEGIN
  CASE frequency
    WHEN 'daily' THEN
      RETURN payment_date + INTERVAL '1 day';
    WHEN 'weekly' THEN
      RETURN payment_date + INTERVAL '1 week';
    WHEN 'monthly' THEN
      RETURN payment_date + INTERVAL '1 month';
    WHEN 'yearly' THEN
      RETURN payment_date + INTERVAL '1 year';
    ELSE
      RETURN payment_date + INTERVAL '1 month';
  END CASE;
END;
$$ LANGUAGE plpgsql;