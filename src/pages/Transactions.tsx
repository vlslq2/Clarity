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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tranzacții</h1>
          <p className="text-gray-600 mt-1">Gestionează toate tranzacțiile tale</p>
        </div>
        <button 
          onClick={handleAddTransaction}
          className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" />
          Adaugă tranzacție
        </button>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Caută tranzacții..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mx-auto mb-3">
            <ArrowDownLeft size={24} className="text-red-600" />
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Cheltuieli</p>
          <p className="text-2xl font-bold text-red-600">
            {totalExpenses.toLocaleString('ro-RO')} RON
          </p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3">
            <ArrowUpRight size={24} className="text-green-600" />
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Venituri</p>
          <p className="text-2xl font-bold text-green-600">
            {totalIncome.toLocaleString('ro-RO')} RON
          </p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mx-auto mb-3">
            <div className="w-6 h-6 bg-indigo-600 rounded-full"></div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Sold net</p>
          <p className="text-2xl font-bold text-indigo-600">
            {(totalIncome - totalExpenses).toLocaleString('ro-RO')} RON
          </p>
        </Card>
      </div>

      {/* Transactions List */}
      <Card className="overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="p-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <span className="text-xl">
                        {transaction.category?.icon || '📦'}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {transaction.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600">{transaction.transaction_date}</span>
                        <span className="text-sm px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                          {transaction.category?.name || 'Necategorizat'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('ro-RO')} RON
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditTransaction(transaction)}
                        className="w-8 h-8 flex items-center justify-center text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">Nu ai încă tranzacții</p>
              <p className="text-sm text-gray-400 mt-1">Adaugă prima ta tranzacție pentru a începe</p>
              <button 
                onClick={handleAddTransaction}
                className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
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