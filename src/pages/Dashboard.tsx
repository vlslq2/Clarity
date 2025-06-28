import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Target, ArrowUpRight, ArrowDownRight, Plus, Sparkles } from 'lucide-react';
import Card from '../components/Card';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { useBudgets } from '../hooks/useBudgets';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { categories } = useCategories();
  const { budgetSummaries } = useBudgets();

  // Calculate stats from real data
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  const currentMonthTransactions = transactions.filter(t => 
    t.transaction_date.startsWith(currentMonth)
  );

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalBalance = totalIncome - totalExpenses;

  // Get recent transactions (last 4)
  const recentTransactions = transactions.slice(0, 4);

  // Get budget progress for top categories
  const topBudgets = budgetSummaries.slice(0, 4);

  const stats = [
    {
      title: 'Sold total',
      value: `${totalBalance.toLocaleString()} RON`,
      change: '+2.5%',
      trend: 'up' as const,
      icon: Wallet,
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      glowColor: 'shadow-blue-500/25',
    },
    {
      title: 'Cheltuieli luna aceasta',
      value: `${totalExpenses.toLocaleString()} RON`,
      change: '-8.2%',
      trend: 'down' as const,
      icon: TrendingDown,
      gradient: 'from-red-500 via-red-600 to-pink-600',
      glowColor: 'shadow-red-500/25',
    },
    {
      title: 'Venituri luna aceasta',
      value: `${totalIncome.toLocaleString()} RON`,
      change: '+12.3%',
      trend: 'up' as const,
      icon: TrendingUp,
      gradient: 'from-green-500 via-green-600 to-emerald-600',
      glowColor: 'shadow-green-500/25',
    },
    {
      title: 'Categorii active',
      value: `${categories.length}`,
      change: '+1',
      trend: 'up' as const,
      icon: Target,
      gradient: 'from-purple-500 via-purple-600 to-indigo-600',
      glowColor: 'shadow-purple-500/25',
    },
  ];

  if (transactionsLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-purple-600 rounded-full animate-spin animation-delay-150"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with enhanced styling */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Bună, {user?.user_metadata?.full_name?.split(' ')[0] || 'Utilizator'}!
            </h1>
            <div className="flex items-center space-x-1">
              <span className="text-2xl">👋</span>
              <Sparkles size={24} className="text-yellow-500 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 text-lg">Iată o privire de ansamblu asupra finanțelor tale</p>
        </div>
        <button className="btn-primary flex items-center sm:w-auto w-full justify-center group">
          <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-200" />
          Adaugă tranzacție
        </button>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} hover glass className="group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 group-hover:text-gradient transition-all duration-300">
                    {stat.value}
                  </p>
                  <div className={`flex items-center text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? 
                      <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" /> : 
                      <ArrowDownRight size={16} className="group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform duration-200" />
                    }
                    <span className="ml-1">{stat.change}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className={`w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg ${stat.glowColor} group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    <Icon size={24} className="text-white group-hover:scale-110 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Enhanced Recent Transactions */}
        <Card glass className="overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Tranzacții recente</h2>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105">
              Vezi toate
            </button>
          </div>
          <div className="space-y-1">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction, index) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-indigo-50/30 transition-all duration-200 group border border-transparent hover:border-indigo-100">
                  <div className="flex items-center flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-all duration-200 group-hover:scale-110 ${
                      transaction.amount > 0 
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 group-hover:shadow-lg group-hover:shadow-green-500/20' 
                        : 'bg-gradient-to-r from-gray-100 to-slate-100 group-hover:shadow-lg group-hover:shadow-gray-500/20'
                    }`}>
                      <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                        {transaction.category?.icon || '📦'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate group-hover:text-indigo-900 transition-colors duration-200">
                        {transaction.description}
                      </p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-sm text-gray-600">{transaction.transaction_date}</span>
                        <span className="text-sm px-2 py-0.5 bg-gray-100 group-hover:bg-indigo-100 rounded-md text-gray-700 group-hover:text-indigo-700 truncate transition-all duration-200">
                          {transaction.category?.name || 'Necategorizat'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className={`text-lg font-semibold transition-all duration-200 ${
                      transaction.amount > 0 
                        ? 'text-green-600 group-hover:text-green-700' 
                        : 'text-gray-900 group-hover:text-gray-800'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount} RON
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <TrendingUp size={36} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium mb-2">Nu ai încă tranzacții</p>
                <p className="text-sm text-gray-400">Adaugă prima ta tranzacție pentru a începe</p>
              </div>
            )}
          </div>
        </Card>

        {/* Enhanced Budget Overview */}
        <Card glass className="overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Bugete luna aceasta</h2>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105">
              Gestionează
            </button>
          </div>
          <div className="space-y-6">
            {topBudgets.length > 0 ? (
              topBudgets.map((budget, index) => (
                <div key={budget.id} className="group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                        {budget.category_icon}
                      </span>
                      <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-900 transition-colors duration-200">
                        {budget.category_name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      {budget.spent_amount.toLocaleString()} / {budget.allocated_amount.toLocaleString()} RON
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                    <div 
                      className="h-3 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                      style={{ 
                        width: `${Math.min(budget.utilization_percentage, 100)}%`,
                        backgroundColor: budget.category_color
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-medium">
                      {Math.round(budget.utilization_percentage)}% utilizat
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {budget.remaining_amount.toLocaleString()} RON rămase
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Target size={36} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium mb-2">Nu ai bugete configurate</p>
                <p className="text-sm text-gray-400">Creează primul tău buget pentru a urmări cheltuielile</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;