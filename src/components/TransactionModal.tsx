import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, FileText, Tag } from 'lucide-react';
import Card from './Card';

interface TransactionModalProps {
  transaction?: any;
  categories: any[];
  onSave: (transaction: any) => void;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction,
  categories,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category_id: '',
    transaction_date: new Date().toISOString().split('T')[0],
    type: 'expense' as 'income' | 'expense',
    tags: [] as string[],
  });

  const commonDescriptions = {
    expense: [
      'Cumpărături Kaufland',
      'Cumpărături Carrefour',
      'Cumpărături Lidl',
      'Benzină OMV',
      'Benzină Petrom',
      'Factura curent',
      'Factura gaz',
      'Factura internet',
      'Abonament Netflix',
      'Abonament Spotify',
      'Masă restaurant',
      'Cafea',
      'Transport public',
      'Uber/Bolt',
      'Medicament farmacie',
      'Consultație medicală'
    ],
    income: [
      'Salariu',
      'Bonus',
      'Freelancing',
      'Vânzare',
      'Dividende',
      'Dobândă',
      'Cadou bani',
      'Rambursare',
      'Comision',
      'Venit suplimentar'
    ]
  };

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description || '',
        amount: Math.abs(transaction.amount).toString(),
        category_id: transaction.category_id || '',
        transaction_date: transaction.transaction_date || new Date().toISOString().split('T')[0],
        type: transaction.type || 'expense',
        tags: transaction.tags || [],
      });
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Te rog să introduci o sumă validă');
      return;
    }

    if (!formData.category_id) {
      alert('Te rog să selectezi o categorie');
      return;
    }

    if (!formData.description.trim()) {
      alert('Te rog să introduci o descriere');
      return;
    }

    onSave({
      ...formData,
      amount: formData.type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
    });
  };

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4 safe-area-inset-top safe-area-inset-bottom">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto border-2 border-gray-300/80 shadow-2xl shadow-gray-900/20" glass>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {transaction ? 'Editează tranzacția' : 'Adaugă tranzacție nouă'}
          </h2>
          <button
            onClick={onClose}
            className="touch-target text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-95 border border-gray-200/60 hover:border-gray-300/80"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Enhanced Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Tip tranzacție</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`p-4 rounded-xl border-2 transition-all duration-200 shadow-md touch-target ${
                  formData.type === 'expense'
                    ? 'border-red-500 bg-red-50 text-red-700 scale-[1.02] shadow-red-500/20'
                    : 'border-gray-300/80 hover:border-gray-400/90 hover:bg-gray-50 shadow-gray-900/10 active:scale-[0.98]'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">💸</div>
                  <div className="font-medium text-sm sm:text-base">Cheltuială</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={`p-4 rounded-xl border-2 transition-all duration-200 shadow-md touch-target ${
                  formData.type === 'income'
                    ? 'border-green-500 bg-green-50 text-green-700 scale-[1.02] shadow-green-500/20'
                    : 'border-gray-300/80 hover:border-gray-400/90 hover:bg-gray-50 shadow-gray-900/10 active:scale-[0.98]'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="font-medium text-sm sm:text-base">Venit</div>
                </div>
              </button>
            </div>
          </div>

          {/* Enhanced Description with suggestions */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descriere
            </label>
            <div className="relative">
              <FileText size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="description"
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-mobile pl-10"
                placeholder={formData.type === 'expense' ? 'Ex: Cumpărături Kaufland' : 'Ex: Salariu'}
                list="description-suggestions"
                autoComplete="off"
              />
              <datalist id="description-suggestions">
                {commonDescriptions[formData.type].map((desc) => (
                  <option key={desc} value={desc} />
                ))}
              </datalist>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Începe să scrii pentru a vedea sugestii
            </p>
          </div>

          {/* Enhanced Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Sumă (RON)
            </label>
            <div className="relative">
              <DollarSign size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="input-mobile pl-10"
                placeholder="0.00"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Enhanced Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categorie
            </label>
            <div className="relative">
              <Tag size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                id="category"
                required
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="input-mobile pl-10 appearance-none"
              >
                <option value="">Selectează categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Enhanced Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Data
            </label>
            <div className="relative">
              <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="date"
                type="date"
                required
                value={formData.transaction_date}
                onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                className="input-mobile pl-10"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Enhanced Submit Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Anulează
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              {transaction ? 'Actualizează' : 'Adaugă'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TransactionModal;