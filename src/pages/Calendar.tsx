import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import Card from '../components/Card';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import TransactionModal from '../components/TransactionModal';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { categories } = useCategories();
  
  const monthNames = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
  ];

  const dayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  // Group transactions by date
  const transactionsByDate = useMemo(() => {
    const grouped: { [key: string]: any[] } = {};
    transactions.forEach(transaction => {
      const date = transaction.transaction_date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });
    return grouped;
  }, [transactions]);

  // Calculate monthly stats
  const monthlyStats = useMemo(() => {
    const currentMonth = currentDate.toISOString().slice(0, 7);
    const monthTransactions = transactions.filter(t => 
      t.transaction_date.startsWith(currentMonth)
    );

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      income,
      expenses,
      net: income - expenses,
      transactionCount: monthTransactions.length
    };
  }, [transactions, currentDate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  const formatDateKey = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month, day).toISOString().split('T')[0];
  };

  const handleDayClick = (day: number | null) => {
    if (!day) return;
    const dateKey = formatDateKey(day);
    setSelectedDate(selectedDate === dateKey ? null : dateKey);
  };

  const handleAddTransaction = (date?: string) => {
    setEditingTransaction(null);
    if (date) {
      setSelectedDate(date);
    }
    setShowModal(true);
  };

  const getDayTransactions = (day: number | null) => {
    if (!day) return [];
    const dateKey = formatDateKey(day);
    return transactionsByDate[dateKey] || [];
  };

  const getDayTotal = (day: number | null) => {
    const dayTransactions = getDayTransactions(day);
    return dayTransactions.reduce((sum, t) => sum + t.amount, 0);
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return dayDate.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">Vizualizează tranzacțiile pe calendar</p>
        </div>
        <button 
          onClick={() => handleAddTransaction()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" />
          Adaugă Tranzacție
        </button>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-sm font-medium text-gray-600 mb-1">Cheltuieli</p>
          <p className="text-xl font-bold text-red-600">
            -{monthlyStats.expenses.toLocaleString('ro-RO')} RON
          </p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm font-medium text-gray-600 mb-1">Venituri</p>
          <p className="text-xl font-bold text-green-600">
            +{monthlyStats.income.toLocaleString('ro-RO')} RON
          </p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm font-medium text-gray-600 mb-1">Total Net</p>
          <p className={`text-xl font-bold ${
            monthlyStats.net >= 0 ? 'text-indigo-600' : 'text-red-600'
          }`}>
            {monthlyStats.net >= 0 ? '+' : ''}{monthlyStats.net.toLocaleString('ro-RO')} RON
          </p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm font-medium text-gray-600 mb-1">Tranzacții</p>
          <p className="text-xl font-bold text-purple-600">{monthlyStats.transactionCount}</p>
        </Card>
      </div>

      {/* Calendar */}
      <Card className="overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <button
            onClick={() => navigateMonth('prev')}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const dayTransactions = getDayTransactions(day);
              const dayTotal = getDayTotal(day);
              const dateKey = day ? formatDateKey(day) : '';
              const isSelected = selectedDate === dateKey;
              const todayClass = isToday(day);
              
              return (
                <div
                  key={index}
                  className={`h-20 p-2 border border-gray-100 rounded-lg transition-all duration-200 ${
                    day ? 'hover:bg-gray-50 cursor-pointer' : ''
                  } ${isSelected ? 'bg-indigo-50 border-indigo-200' : ''} ${
                    todayClass ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => handleDayClick(day)}
                >
                  {day && (
                    <div className="h-full flex flex-col">
                      <div className={`text-sm font-medium mb-1 ${
                        todayClass ? 'text-blue-700' : 'text-gray-900'
                      } ${isSelected ? 'text-indigo-700' : ''}`}>
                        {day}
                      </div>
                      
                      {dayTransactions.length > 0 && (
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="text-xs text-center">
                            <div className={`font-medium ${
                              dayTotal >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {dayTotal >= 0 ? '+' : ''}{Math.abs(dayTotal).toLocaleString('ro-RO', { maximumFractionDigits: 0 })}
                            </div>
                            <div className="text-gray-500">
                              {dayTransactions.length} tranz.
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && transactionsByDate[selectedDate] && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Tranzacții din {new Date(selectedDate).toLocaleDateString('ro-RO', { 
                day: 'numeric', 
                month: 'long',
                year: 'numeric'
              })}
            </h3>
            <button
              onClick={() => handleAddTransaction(selectedDate)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Adaugă
            </button>
          </div>
          
          <div className="space-y-3">
            {transactionsByDate[selectedDate].map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    transaction.amount > 0 ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <span className="text-lg">
                      {transaction.category?.icon || '📦'}
                    </span>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      {transaction.category?.name || 'Necategorizat'}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('ro-RO')} RON
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Transaction Modal */}
      {showModal && (
        <TransactionModal
          transaction={editingTransaction}
          categories={categories}
          onSave={async (transactionData) => {
            if (!editingTransaction && selectedDate) {
              transactionData.transaction_date = selectedDate;
            }
            
            if (editingTransaction) {
              await updateTransaction(editingTransaction.id, transactionData);
            } else {
              await addTransaction(transactionData);
            }
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Calendar;