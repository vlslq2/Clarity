import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Calendar as CalendarIcon, TrendingUp, TrendingDown } from 'lucide-react';
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

  const dayNames = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'];

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

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Ești sigur că vrei să ștergi această tranzacție?')) {
      await deleteTransaction(id);
    }
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">Vizualizează tranzacțiile pe calendar</p>
        </div>
        <button 
          onClick={() => handleAddTransaction()}
          className="btn-primary flex items-center justify-center sm:w-auto"
        >
          <Plus size={20} className="mr-2" />
          <span className="hidden sm:inline">Adaugă Tranzacție</span>
          <span className="sm:hidden">Adaugă</span>
        </button>
      </div>

      {/* Monthly Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="text-center p-4">
          <p className="text-xs sm:text-sm text-gray-600">Cheltuieli</p>
          <p className="text-lg sm:text-2xl font-bold text-red-600 mt-1">
            -{monthlyStats.expenses.toLocaleString()} RON
          </p>
          <p className="text-xs text-gray-500 mt-1">{monthlyStats.transactionCount} tranzacții</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-xs sm:text-sm text-gray-600">Venituri</p>
          <p className="text-lg sm:text-2xl font-bold text-green-600 mt-1">
            +{monthlyStats.income.toLocaleString()} RON
          </p>
          <p className="text-xs text-gray-500 mt-1">luna aceasta</p>
        </Card>
        <Card className="text-center p-4 col-span-2 lg:col-span-1">
          <p className="text-xs sm:text-sm text-gray-600">Total Net</p>
          <p className={`text-lg sm:text-2xl font-bold mt-1 ${
            monthlyStats.net >= 0 ? 'text-indigo-600' : 'text-red-600'
          }`}>
            {monthlyStats.net >= 0 ? '+' : ''}{monthlyStats.net.toLocaleString()} RON
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {monthlyStats.net >= 0 ? 'surplus' : 'deficit'}
          </p>
        </Card>
        <Card className="text-center p-4 col-span-2 lg:col-span-1">
          <p className="text-xs sm:text-sm text-gray-600">Medie zilnică</p>
          <p className="text-lg sm:text-2xl font-bold text-purple-600 mt-1">
            {Math.round(monthlyStats.expenses / new Date().getDate()).toLocaleString()} RON
          </p>
          <p className="text-xs text-gray-500 mt-1">cheltuieli</p>
        </Card>
      </div>

      {/* Calendar */}
      <Card className="overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 sm:p-3 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 sm:p-3 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-2 sm:p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayTransactions = getDayTransactions(day);
              const dayTotal = getDayTotal(day);
              const dateKey = day ? formatDateKey(day) : '';
              const isSelected = selectedDate === dateKey;
              const todayClass = isToday(day);
              
              return (
                <div
                  key={index}
                  className={`min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 border border-gray-100 rounded-lg transition-all duration-200 ${
                    day ? 'hover:bg-gray-50 cursor-pointer active:scale-95' : ''
                  } ${isSelected ? 'bg-indigo-50 border-indigo-200' : ''} ${
                    todayClass ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => handleDayClick(day)}
                >
                  {day && (
                    <>
                      <div className={`text-xs sm:text-sm font-medium mb-1 ${
                        todayClass ? 'text-blue-700' : 'text-gray-900'
                      } ${isSelected ? 'text-indigo-700' : ''}`}>
                        {day}
                      </div>
                      
                      {dayTransactions.length > 0 && (
                        <div className="space-y-1">
                          {/* Show first 2 transactions on mobile, 3 on desktop */}
                          {dayTransactions.slice(0, window.innerWidth < 640 ? 2 : 3).map((transaction, txIndex) => (
                            <div
                              key={txIndex}
                              className={`text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-md truncate transition-colors ${
                                transaction.amount > 0
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                              title={`${transaction.description} - ${transaction.amount} RON`}
                            >
                              {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount)} RON
                            </div>
                          ))}
                          
                          {dayTransactions.length > (window.innerWidth < 640 ? 2 : 3) && (
                            <div className="text-xs text-gray-500 px-1 sm:px-2">
                              +{dayTransactions.length - (window.innerWidth < 640 ? 2 : 3)} mai multe
                            </div>
                          )}
                          
                          {dayTransactions.length > 1 && (
                            <div className={`text-xs font-medium px-1 sm:px-2 py-0.5 rounded-md ${
                              dayTotal >= 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                            }`}>
                              Total: {dayTotal >= 0 ? '+' : ''}{dayTotal.toLocaleString()} RON
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && transactionsByDate[selectedDate] && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Tranzacții din {new Date(selectedDate).toLocaleDateString('ro-RO', { 
                day: 'numeric', 
                month: 'long',
                year: 'numeric'
              })}
            </h3>
            <button
              onClick={() => handleAddTransaction(selectedDate)}
              className="btn-primary text-sm px-4 py-2"
            >
              <Plus size={16} className="mr-1" />
              Adaugă
            </button>
          </div>
          
          <div className="space-y-3">
            {transactionsByDate[selectedDate].map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                <div className="flex items-center flex-1 min-w-0">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mr-3 sm:mr-4 ${
                    transaction.amount > 0 ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <span className="text-lg sm:text-xl">
                      {transaction.category?.icon || '📦'}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate text-sm sm:text-base">
                      {transaction.description}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {transaction.category?.name || 'Necategorizat'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="text-right">
                    <p className={`text-sm sm:text-lg font-semibold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount} RON
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditTransaction(transaction)}
                      className="p-1.5 sm:p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
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
            // Set the transaction date to selected date if adding new transaction
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