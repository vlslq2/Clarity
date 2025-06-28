import React, { useState } from 'react';
import { Search, Filter, Plus, ArrowUpDown, Calendar, Tag, Edit2, Trash2 } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tranzacții</h1>
          <p className="text-gray-600 mt-1">Gestionează și urmărește toate tranzacțiile tale</p>
        </div>
        <button 
          onClick={handleAddTransaction}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Adaugă tranzacție
        </button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Caută tranzacții..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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

      {/* Transactions List */}
      <Card>
        <div className="overflow-hidden">
          <div className="space-y-0">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction, index) => (
                <div 
                  key={transaction.id} 
                  className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group ${
                    index !== filteredTransactions.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                      transaction.type === 'income' ? 'bg-green-50' : 'bg-gray-50'
                    }`}>
                      <span className="text-xl">
                        {transaction.category?.icon || '📦'}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <div className="flex items-center mt-1 space-x-3">
                        <span className="text-sm text-gray-600">{transaction.transaction_date}</span>
                        <span className="text-sm px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                          {transaction.category?.name || 'Necategorizat'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount} RON
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditTransaction(transaction)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Tag size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">Nu ai încă tranzacții</p>
                <p className="text-sm text-gray-400 mt-1">Adaugă prima ta tranzacție pentru a începe urmărirea cheltuielilor</p>
                <button 
                  onClick={handleAddTransaction}
                  className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                  Adaugă prima tranzacție
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total cheltuieli</p>
            <p className="text-2xl font-bold text-red-600 mt-1">-{totalExpenses.toLocaleString()} RON</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total venituri</p>
            <p className="text-2xl font-bold text-green-600 mt-1">+{totalIncome.toLocaleString()} RON</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Sold net</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              {totalIncome - totalExpenses > 0 ? '+' : ''}{(totalIncome - totalExpenses).toLocaleString()} RON
            </p>
          </div>
        </Card>
      </div>

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