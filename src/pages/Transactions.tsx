import React, { useState } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
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
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      {/* Header */}
      <div className="px-1">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Tranzacții</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Gestionează toate tranzacțiile</p>
          </div>
          <button 
            onClick={handleAddTransaction}
            className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center text-sm"
          >
            <Plus size={18} className="mr-2" />
            Adaugă
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="mx-1 p-3">
        <div className="space-y-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Caută..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-400 flex-shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm"
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

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 px-1">
        <Card className="p-3 text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-lg mx-auto mb-2">
            <ArrowDownLeft size={16} className="text-red-600" />
          </div>
          <p className="text-xs font-medium text-gray-600 mb-1">Cheltuieli</p>
          <p className="text-sm font-bold text-red-600 leading-tight">
            {totalExpenses.toLocaleString('ro-RO', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-gray-500">RON</p>
        </Card>
        
        <Card className="p-3 text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mx-auto mb-2">
            <ArrowUpRight size={16} className="text-green-600" />
          </div>
          <p className="text-xs font-medium text-gray-600 mb-1">Venituri</p>
          <p className="text-sm font-bold text-green-600 leading-tight">
            {totalIncome.toLocaleString('ro-RO', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-gray-500">RON</p>
        </Card>
        
        <Card className="p-3 text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg mx-auto mb-2">
            <div className="w-4 h-4 bg-indigo-600 rounded-full"></div>
          </div>
          <p className="text-xs font-medium text-gray-600 mb-1">Sold net</p>
          <p className="text-sm font-bold text-indigo-600 leading-tight">
            {(totalIncome - totalExpenses).toLocaleString('ro-RO', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-gray-500">RON</p>
        </Card>
      </div>

      {/* Transactions List */}
      <Card className="mx-1 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="p-3 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <span className="text-lg">
                      {transaction.category?.icon || '📦'}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1 mr-2">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {transaction.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-600">{transaction.transaction_date}</span>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-700 truncate max-w-20">
                            {transaction.category?.name || 'Necategorizat'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount).toLocaleString('ro-RO', { maximumFractionDigits: 0 })}
                          </p>
                          <p className="text-xs text-gray-500">RON</p>
                        </div>
                        
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditTransaction(transaction)}
                            className="w-7 h-7 flex items-center justify-center text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="w-7 h-7 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 px-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">Nu ai încă tranzacții</p>
              <p className="text-xs text-gray-400 mt-1">Adaugă prima ta tranzacție</p>
              <button 
                onClick={handleAddTransaction}
                className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm"
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