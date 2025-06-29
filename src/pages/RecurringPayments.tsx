import React, { useState } from 'react';
import { Plus, Play, Pause, Edit2, Trash2, Calendar, CreditCard } from 'lucide-react';
import Card from '../components/Card';
import { useRecurringPayments } from '../hooks/useRecurringPayments';
import { useCategories } from '../hooks/useCategories';
import { useAccounts } from '../hooks/useAccounts';
import RecurringPaymentModal from '../components/RecurringPaymentModal';

const RecurringPayments: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);

  const { recurringPayments, loading, addRecurringPayment, updateRecurringPayment, deleteRecurringPayment, togglePaymentStatus } = useRecurringPayments();
  const { categories } = useCategories();
  const { accounts } = useAccounts();

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Zilnic';
      case 'weekly': return 'Săptămânal';
      case 'monthly': return 'Lunar';
      case 'yearly': return 'Anual';
      default: return frequency;
    }
  };

  const handleAddPayment = () => {
    setEditingPayment(null);
    setShowModal(true);
  };

  const handleEditPayment = (payment: any) => {
    setEditingPayment(payment);
    setShowModal(true);
  };

  const handleDeletePayment = async (id: string) => {
    if (window.confirm('Ești sigur că vrei să ștergi această plată recurentă?')) {
      await deleteRecurringPayment(id);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await togglePaymentStatus(id, !currentStatus);
  };

  const activePayments = recurringPayments.filter(p => p.is_active);
  const inactivePayments = recurringPayments.filter(p => !p.is_active);
  
  const monthlyIncome = activePayments.filter(p => p.amount > 0).reduce((sum, p) => sum + p.amount, 0);
  const monthlyExpenses = activePayments.filter(p => p.amount < 0).reduce((sum, p) => sum + Math.abs(p.amount), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plăți Recurente</h1>
          <p className="text-gray-600 mt-1">Gestionează abonamentele și plățile recurente</p>
        </div>
        <button 
          onClick={handleAddPayment}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" />
          Adaugă Plată
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3">
            <CreditCard size={24} className="text-green-600" />
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Venituri Recurente</p>
          <p className="text-2xl font-bold text-green-600">
            +{monthlyIncome.toLocaleString('ro-RO')} RON
          </p>
          <p className="text-sm text-gray-500">lunar</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mx-auto mb-3">
            <CreditCard size={24} className="text-red-600" />
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Cheltuieli Recurente</p>
          <p className="text-2xl font-bold text-red-600">
            -{monthlyExpenses.toLocaleString('ro-RO')} RON
          </p>
          <p className="text-sm text-gray-500">lunar</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mx-auto mb-3">
            <div className="w-6 h-6 bg-indigo-600 rounded-full"></div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Net Lunar</p>
          <p className="text-2xl font-bold text-indigo-600">
            {monthlyIncome - monthlyExpenses > 0 ? '+' : ''}{(monthlyIncome - monthlyExpenses).toLocaleString('ro-RO')} RON
          </p>
          <p className="text-sm text-gray-500">{activePayments.length} active</p>
        </Card>
      </div>

      {/* Active Payments */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Plăți Active</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {activePayments.length > 0 ? (
            activePayments.map((payment) => (
              <Card key={payment.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-xl">
                      {payment.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{payment.name}</h3>
                      <p className="text-sm text-gray-600">{payment.category?.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleStatus(payment.id, payment.is_active)}
                      className="w-8 h-8 flex items-center justify-center text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      title="Pauză"
                    >
                      <Pause size={16} />
                    </button>
                    <button
                      onClick={() => handleEditPayment(payment)}
                      className="w-8 h-8 flex items-center justify-center text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Editează"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeletePayment(payment.id)}
                      className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Șterge"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Sumă</span>
                    <span className={`text-lg font-semibold ${
                      payment.amount > 0 ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {payment.amount > 0 ? '+' : ''}{payment.amount.toLocaleString('ro-RO')} RON
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Frecvența</span>
                    <span className="text-sm text-gray-900">{getFrequencyLabel(payment.frequency)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Următoarea plată</span>
                    <span className="text-sm text-gray-900">{payment.next_payment_date}</span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">Nu ai plăți recurente active</p>
              <p className="text-sm text-gray-400 mt-1">Adaugă prima ta plată recurentă</p>
              <button 
                onClick={handleAddPayment}
                className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
              >
                Adaugă prima plată
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Inactive Payments */}
      {inactivePayments.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Plăți Inactive</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {inactivePayments.map((payment) => (
              <Card key={payment.id} className="p-6 opacity-60">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl grayscale">
                      {payment.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{payment.name}</h3>
                      <p className="text-sm text-gray-600">{payment.category?.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleStatus(payment.id, payment.is_active)}
                      className="w-8 h-8 flex items-center justify-center text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Activează"
                    >
                      <Play size={16} />
                    </button>
                    <button
                      onClick={() => handleEditPayment(payment)}
                      className="w-8 h-8 flex items-center justify-center text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Editează"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeletePayment(payment.id)}
                      className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Șterge"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Sumă</span>
                    <span className="text-lg font-semibold text-gray-400">
                      {payment.amount > 0 ? '+' : ''}{payment.amount.toLocaleString('ro-RO')} RON
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Status</span>
                    <span className="text-sm text-red-600 font-medium">Inactiv</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recurring Payment Modal */}
      {showModal && (
        <RecurringPaymentModal
          payment={editingPayment}
          categories={categories}
          accounts={accounts}
          onSave={async (paymentData) => {
            if (editingPayment) {
              await updateRecurringPayment(editingPayment.id, paymentData);
            } else {
              await addRecurringPayment(paymentData);
            }
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default RecurringPayments;