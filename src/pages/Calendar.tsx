import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Card from '../components/Card';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
  ];

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
  };

  const expenses = {
    '5': [{ amount: -125, description: 'Kaufland' }],
    '8': [{ amount: -29.99, description: 'Netflix' }],
    '12': [{ amount: -180, description: 'Benzină' }, { amount: -45, description: 'Parcare' }],
    '15': [{ amount: 4500, description: 'Salariu' }],
    '18': [{ amount: -450, description: 'Emag' }],
    '22': [{ amount: -89.30, description: 'Mega Image' }],
    '25': [{ amount: -320, description: 'Facturi' }],
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">Vizualizează tranzacțiile pe calendar</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center">
          <Plus size={20} className="mr-2" />
          Adaugă Eveniment
        </button>
      </div>

      <Card>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'].map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((day, index) => (
            <div
              key={index}
              className={`min-h-[100px] p-2 border border-gray-100 ${
                day ? 'hover:bg-gray-50 cursor-pointer' : ''
              }`}
            >
              {day && (
                <>
                  <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                  {expenses[day.toString()] && (
                    <div className="space-y-1">
                      {expenses[day.toString()].map((expense, expIndex) => (
                        <div
                          key={expIndex}
                          className={`text-xs px-2 py-1 rounded-md truncate ${
                            expense.amount > 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                          title={expense.description}
                        >
                          {expense.amount > 0 ? '+' : ''}{expense.amount} RON
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Cheltuieli Luna Aceasta</p>
            <p className="text-2xl font-bold text-red-600 mt-1">-1,239.29 RON</p>
            <p className="text-sm text-gray-500 mt-1">12 tranzacții</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Venituri Luna Aceasta</p>
            <p className="text-2xl font-bold text-green-600 mt-1">+4,500 RON</p>
            <p className="text-sm text-gray-500 mt-1">1 tranzacție</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Net</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">+3,260.71 RON</p>
            <p className="text-sm text-gray-500 mt-1">13 tranzacții</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;