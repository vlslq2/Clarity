import React, { useState } from 'react';
import { Plus, Play, Pause, Settings, Calendar, CreditCard } from 'lucide-react';
import Card from '../components/Card';

const RecurringPayments: React.FC = () => {
  const [recurringPayments, setRecurringPayments] = useState([
    {
      id: '1',
      name: 'Netflix',
      amount: -29.99,
      category: 'Divertisment',
      frequency: 'monthly',
      nextPayment: '2025-02-15',
      active: true,
      icon: '🎬'
    },
    {
      id: '2',
      name: 'Spotify',
      amount: -19.99,
      category: 'Divertisment',
      frequency: 'monthly',
      nextPayment: '2025-02-12',
      active: true,
      icon: '🎵'
    },
    {
      id: '3',
      name: 'Digi Internet',
      amount: -49.99,
      category: 'Utilități',
      frequency: 'monthly',
      nextPayment: '2025-02-05',
      active: true,
      icon: '📡'
    },
    {
      id: '4',
      name: 'Fitness Gym',
      amount: -120.00,
      category: 'Sănătate',
      frequency: 'monthly',
      nextPayment: '2025-02-20',
      active: false,
      icon: '💪'
    },
    {
      id: '5',
      name: 'Salariu',
      amount: 4500,
      category: 'Venit',
      frequency: 'monthly',
      nextPayment: '2025-02-28',
      active: true,
      icon: '💰'
    },
    {
      id: '6',
      name: 'Asigurare Auto',
      amount: -180,
      category: 'Transport',
      frequency: 'monthly',
      nextPayment: '2025-02-10',
      active: true,
      icon: '🚗'
    }
  ]);

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return 'Săptămânal';
      case 'monthly': return 'Lunar';
      case 'yearly': return 'Anual';
      default: return frequency;
    }
  };

  const togglePayment = (id: string) => {
    setRecurringPayments(payments =>
      payments.map(payment =>
        payment.id === id ? { ...payment, active: !payment.active } : payment
      )
    );
  };

  const activePayments = recurringPayments.filter(p => p.active);
  const inactivePayments = recurringPayments.filter(p => !p.active);
  
  const monthlyIncome = activePayments.filter(p => p.amount > 0).reduce((sum, p) => sum + p.amount, 0);
  const monthlyExpenses = activePayments.filter(p => p.amount < 0).reduce((sum, p) => sum + Math.abs(p.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plăți Recurente</h1>
          <p className="text-gray-600 mt-1">Gestionează abonamentele și plățile recurente</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center">
          <Plus size={20} className="mr-2" />
          Adaugă Plată
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Venituri Recurente</p>
            <p className="text-2xl font-bold text-green-600 mt-1">+{monthlyIncome.toLocaleString()} RON</p>
            <p className="text-sm text-gray-500 mt-1">lunar</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Cheltuieli Recurente</p>
            <p className="text-2xl font-bold text-red-600 mt-1">-{monthlyExpenses.toLocaleString()} RON</p>
            <p className="text-sm text-gray-500 mt-1">lunar</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Net Lunar</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              {monthlyIncome - monthlyExpenses > 0 ? '+' : ''}{(monthlyIncome - monthlyExpenses).toLocaleString()} RON
            </p>
            <p className="text-sm text-gray-500 mt-1">{activePayments.length} active</p>
          </div>
        </Card>
      </div>

      {/* Active Payments */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Plăți Active</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activePayments.map((payment) => (
            <Card key={payment.id} hover>
              <div className="flex items-start justify-between">
                <div className="flex items-center flex-1">
                  <div className="text-2xl mr-4">{payment.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{payment.name}</h3>
                    <p className="text-sm text-gray-600">{payment.category}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        {getFrequencyLabel(payment.frequency)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <CreditCard size={14} className="mr-1" />
                        {payment.nextPayment}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${
                      payment.amount > 0 ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {payment.amount > 0 ? '+' : ''}{payment.amount} RON
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => togglePayment(payment.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Pauză"
                    >
                      <Pause size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
                      <Settings size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Inactive Payments */}
      {inactivePayments.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Plăți Inactive</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inactivePayments.map((payment) => (
              <Card key={payment.id} className="opacity-60">
                <div className="flex items-start justify-between">
                  <div className="flex items-center flex-1">
                    <div className="text-2xl mr-4 grayscale">{payment.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{payment.name}</h3>
                      <p className="text-sm text-gray-600">{payment.category}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          {getFrequencyLabel(payment.frequency)}
                        </div>
                        <span className="text-sm text-red-600 font-medium">Inactiv</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-400">
                        {payment.amount > 0 ? '+' : ''}{payment.amount} RON
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => togglePayment(payment.id)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Activează"
                      >
                        <Play size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
                        <Settings size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringPayments;