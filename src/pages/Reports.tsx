import React, { useState, useMemo } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar, Filter } from 'lucide-react';
import Card from '../components/Card';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { useBudgets } from '../hooks/useBudgets';

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { transactions } = useTransactions();
  const { categories } = useCategories();
  const { budgetSummaries } = useBudgets();

  // Calculate data based on selected period
  const reportData = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate = now;

    switch (selectedPeriod) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const filteredTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.transaction_date);
      const inPeriod = transactionDate >= startDate && transactionDate <= endDate;
      const inCategory = selectedCategory === 'all' || t.category_id === selectedCategory;
      return inPeriod && inCategory;
    });

    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Group by category
    const categoryData = categories.map(category => {
      const categoryTransactions = filteredTransactions.filter(t => 
        t.category_id === category.id && t.type === 'expense'
      );
      const amount = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
      
      return {
        name: category.name,
        amount,
        color: category.color,
        percentage: Math.round(percentage),
        transactionCount: categoryTransactions.length
      };
    }).filter(c => c.amount > 0).sort((a, b) => b.amount - a.amount);

    // Monthly trend (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.transaction_date);
        return tDate >= monthStart && tDate <= monthEnd;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      monthlyData.push({
        month: date.toLocaleDateString('ro-RO', { month: 'short' }),
        income,
        expenses
      });
    }

    return {
      totalIncome,
      totalExpenses,
      netAmount: totalIncome - totalExpenses,
      transactionCount: filteredTransactions.length,
      categoryData,
      monthlyData,
      avgDailyExpense: totalExpenses / 30,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
    };
  }, [transactions, categories, selectedPeriod, selectedCategory]);

  const insights = [
    {
      title: 'Cea mai mare cheltuială',
      value: reportData.categoryData[0] ? `${reportData.categoryData[0].name} - ${reportData.categoryData[0].amount.toLocaleString()} RON` : 'N/A',
      change: '+15% față de perioada anterioară',
      type: 'warning' as const
    },
    {
      title: 'Cea mai mică cheltuială',
      value: reportData.categoryData[reportData.categoryData.length - 1] ? 
        `${reportData.categoryData[reportData.categoryData.length - 1].name} - ${reportData.categoryData[reportData.categoryData.length - 1].amount.toLocaleString()} RON` : 'N/A',
      change: '-5% față de perioada anterioară',
      type: 'success' as const
    },
    {
      title: 'Trend general',
      value: reportData.netAmount >= 0 ? 'Surplus financiar' : 'Deficit financiar',
      change: `${reportData.netAmount >= 0 ? '+' : ''}${reportData.netAmount.toLocaleString()} RON`,
      type: reportData.netAmount >= 0 ? 'success' as const : 'warning' as const
    },
    {
      title: 'Rata de economisire',
      value: `${Math.round(reportData.savingsRate)}%`,
      change: `${reportData.savingsRate >= 20 ? 'Excelent' : reportData.savingsRate >= 10 ? 'Bun' : 'Poate fi îmbunătățit'}`,
      type: reportData.savingsRate >= 20 ? 'success' as const : 'info' as const
    }
  ];

  const exportReport = () => {
    const csvContent = [
      ['Categorie', 'Suma (RON)', 'Procent', 'Numar tranzactii'],
      ...reportData.categoryData.map(cat => [
        cat.name,
        cat.amount.toString(),
        cat.percentage.toString() + '%',
        cat.transactionCount.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `raport-cheltuieli-${selectedPeriod}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapoarte și Analize</h1>
          <p className="text-gray-600 mt-1">Obține perspective detaliate asupra cheltuielilor tale</p>
        </div>
        <button 
          onClick={exportReport}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Download size={20} className="mr-2" />
          Exportă Raport
        </button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Calendar size={20} className="text-gray-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="week">Săptămâna aceasta</option>
              <option value="month">Luna aceasta</option>
              <option value="quarter">Trimestrul acesta</option>
              <option value="year">Anul acesta</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Toate categoriile</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <Card key={index} hover>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">{insight.title}</p>
              <p className="text-lg font-bold text-gray-900 mt-2">{insight.value}</p>
              <p className={`text-sm mt-1 ${
                insight.type === 'success' ? 'text-green-600' :
                insight.type === 'warning' ? 'text-yellow-600' :
                insight.type === 'info' ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {insight.change}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income vs Expenses Chart */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Venituri vs Cheltuieli</h2>
            <BarChart3 size={24} className="text-indigo-600" />
          </div>
          
          <div className="space-y-4">
            {reportData.monthlyData.map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{data.month}</span>
                  <div className="text-sm text-gray-600">
                    <span className="text-green-600">+{data.income.toLocaleString()}</span> / 
                    <span className="text-red-600 ml-1">-{data.expenses.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="relative h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500 h-full"
                        style={{ width: `${Math.min((data.income / Math.max(data.income, data.expenses, 1)) * 100, 100)}%` }}
                      />
                      <div 
                        className="bg-red-500 h-full absolute top-0"
                        style={{ 
                          width: `${Math.min((data.expenses / Math.max(data.income, data.expenses, 1)) * 100, 100)}%`,
                          left: `${Math.min((data.income / Math.max(data.income, data.expenses, 1)) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Cheltuieli pe Categorii</h2>
            <PieChart size={24} className="text-indigo-600" />
          </div>
          
          <div className="space-y-4">
            {reportData.categoryData.slice(0, 8).map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {category.amount.toLocaleString()} RON ({category.percentage}%)
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${category.percentage}%`,
                      backgroundColor: category.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Statistici Detaliate</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <TrendingUp size={32} className="text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Total venituri</p>
            <p className="text-lg font-bold text-green-600">{reportData.totalIncome.toLocaleString()} RON</p>
            <p className="text-sm text-gray-500">în perioada selectată</p>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-xl">
            <BarChart3 size={32} className="text-red-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Total cheltuieli</p>
            <p className="text-lg font-bold text-red-600">{reportData.totalExpenses.toLocaleString()} RON</p>
            <p className="text-sm text-gray-500">în perioada selectată</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <PieChart size={32} className="text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Tranzacții</p>
            <p className="text-lg font-bold text-purple-600">{reportData.transactionCount}</p>
            <p className="text-sm text-gray-500">în perioada selectată</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <TrendingUp size={32} className="text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Medie zilnică</p>
            <p className="text-lg font-bold text-blue-600">{Math.round(reportData.avgDailyExpense).toLocaleString()} RON</p>
            <p className="text-sm text-gray-500">cheltuieli</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;