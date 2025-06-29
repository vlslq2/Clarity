import React, { useState } from 'react';
import { Search, Filter, Plus, Edit2, Trash2 } from 'lucide-react';
import Card from '../components/Card';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import TransactionModal from '../components/TransactionModal';

const Transactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('toate');
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { categories } = useCategories();

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'toate' || transaction.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const handleAddTransaction = () => {
    setEditingTransaction(null);
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tranzacții</h1>
          <p className="text-gray-600 mt-1">Gestionează și urmărește toate tranzacțiile tale</p>
        </div>
        <button 
          onClick={handleAddTransaction}
          className="btn-primary flex items-center justify-center sm:w-auto"
        >
          <Plus size={20} className="mr-2" />
          <span className="hidden sm:inline">Adaugă tranzacție</span>
          <span className="sm:hidden">Adaugă</span>
        </button>
      </div>

      {/* Mobile-optimized filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Caută tranzacții..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-mobile pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400 flex-shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-mobile flex-1"
            >
              <option value="toate">Toate categoriile</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Mobile-optimized summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="text-center p-4">
          <p className="text-sm text-gray-600">Total cheltuieli</p>
          <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1">-{totalExpenses.toLocaleString()} RON</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-sm text-gray-600">Total venituri</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">+{totalIncome.toLocaleString()} RON</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-sm text-gray-600">Sold net</p>
          <p className="text-xl sm:text-2xl font-bold text-indigo-600 mt-1">
            {totalIncome - totalExpenses > 0 ? '+' : ''}{(totalIncome - totalExpenses).toLocaleString()} RON
          </p>
        </Card>
      </div>

      {/* Mobile-optimized transactions list */}
      <Card className="overflow-hidden p-0">
        <div className="space-y-0">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
              <div 
                key={transaction.id} 
                className={`p-4 hover:bg-gray-50 transition-colors group ${
                  index !== filteredTransactions.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 ${
                      transaction.type === 'income' ? 'bg-green-50' : 'bg-gray-50'
                    }`}>
                      <span className="text-lg sm:text-xl">
                        {transaction.category?.icon || '📦'}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate text-sm sm:text-base">
                        {transaction.description}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center mt-1 space-y-1 sm:space-y-0 sm:space-x-3">
                        <span className="text-xs sm:text-sm text-gray-600">{transaction.transaction_date}</span>
                        <span className="text-xs sm:text-sm px-2 py-1 bg-gray-100 rounded-md text-gray-700 truncate w-fit">
                          {transaction.category?.name || 'Necategorizat'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
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
                        className="touch-target text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="touch-target text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">Nu ai încă tranzacții</p>
              <p className="text-sm text-gray-400 mt-1">Adaugă prima ta tranzacție pentru a începe urmărirea cheltuielilor</p>
              <button 
                onClick={handleAddTransaction}
                className="mt-4 btn-primary"
              >
                Adaugă prima tranzacție
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Transaction Modal */}
      {showModal && (
        <TransactionModal
          transaction={editingTransaction}
          categories={categories}
          onSave={async (transactionData) => {
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

export default Transactions;