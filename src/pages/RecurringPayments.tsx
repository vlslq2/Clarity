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
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile-optimized header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Plăți Recurente</h1>
          <p className="text-gray-600 mt-1">Gestionează abonamentele și plățile recurente</p>
        </div>
        <button 
          onClick={handleAddPayment}
          className="btn-primary flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" />
          <span className="hidden sm:inline">Adaugă Plată</span>
          <span className="sm:hidden">Adaugă</span>
        </button>
      </div>

      {/* Mobile-optimized Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="text-center p-4">
          <p className="text-sm text-gray-600">Venituri Recurente</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">+{monthlyIncome.toLocaleString()} RON</p>
          <p className="text-sm text-gray-500 mt-1">lunar</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-sm text-gray-600">Cheltuieli Recurente</p>
          <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1">-{monthlyExpenses.toLocaleString()} RON</p>
          <p className="text-sm text-gray-500 mt-1">lunar</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-sm text-gray-600">Net Lunar</p>
          <p className="text-xl sm:text-2xl font-bold text-indigo-600 mt-1">
            {monthlyIncome - monthlyExpenses > 0 ? '+' : ''}{(monthlyIncome - monthlyExpenses).toLocaleString()} RON
          </p>
          <p className="text-sm text-gray-500 mt-1">{activePayments.length} active</p>
        </Card>
      </div>

      {/* Active Payments - Mobile optimized */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Plăți Active</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {activePayments.length > 0 ? (
            activePayments.map((payment) => (
              <Card key={payment.id} hover className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="text-2xl mr-3 flex-shrink-0">{payment.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{payment.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{payment.category?.name}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center mt-2 space-y-1 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{getFrequencyLabel(payment.frequency)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <CreditCard size={14} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{payment.next_payment_date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                    <div className="text-right">
                      <p className={`text-sm sm:text-lg font-semibold ${
                        payment.amount > 0 ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {payment.amount > 0 ? '+' : ''}{payment.amount} RON
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleToggleStatus(payment.id, payment.is_active)}
                        className="touch-target text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Pauză"
                      >
                        <Pause size={16} />
                      </button>
                      <button
                        onClick={() => handleEditPayment(payment)}
                        className="touch-target text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Editează"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePayment(payment.id)}
                        className="touch-target text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Șterge"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 px-4">
              <CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Nu ai plăți recurente active</p>
              <p className="text-sm text-gray-400 mt-1">Adaugă prima ta plată recurentă pentru a automatiza bugetul</p>
              <button 
                onClick={handleAddPayment}
                className="mt-4 btn-primary"
              >
                Adaugă prima plată
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Inactive Payments - Mobile optimized */}
      {inactivePayments.length > 0 && (
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Plăți Inactive</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {inactivePayments.map((payment) => (
              <Card key={payment.id} className="opacity-60 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="text-2xl mr-3 grayscale flex-shrink-0">{payment.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{payment.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{payment.category?.name}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center mt-2 space-y-1 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{getFrequencyLabel(payment.frequency)}</span>
                        </div>
                        <span className="text-sm text-red-600 font-medium">Inactiv</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-sm sm:text-lg font-semibold text-gray-400">
                        {payment.amount > 0 ? '+' : ''}{payment.amount} RON
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleToggleStatus(payment.id, payment.is_active)}
                        className="touch-target text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Activează"
                      >
                        <Play size={16} />
                      </button>
                      <button
                        onClick={() => handleEditPayment(payment)}
                        className="touch-target text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Editează"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePayment(payment.id)}
                        className="touch-target text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Șterge"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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