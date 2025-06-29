import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, Repeat } from 'lucide-react';
import Card from './Card';

interface RecurringPaymentModalProps {
  payment?: any;
  categories: any[];
  accounts: any[];
  onSave: (payment: any) => void;
  onClose: () => void;
}

const RecurringPaymentModal: React.FC<RecurringPaymentModalProps> = ({
  payment,
  categories,
  accounts,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category_id: '',
    account_id: '',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    next_payment_date: '',
    icon: '💳',
    is_active: true,
  });

  useEffect(() => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    
    if (payment) {
      setFormData({
        name: payment.name || '',
        amount: Math.abs(payment.amount).toString(),
        category_id: payment.category_id || '',
        account_id: payment.account_id || '',
        frequency: payment.frequency || 'monthly',
        next_payment_date: payment.next_payment_date || nextMonth.toISOString().split('T')[0],
        icon: payment.icon || '💳',
        is_active: payment.is_active ?? true,
      });
    } else {
      setFormData(prev => ({
        ...prev,
        next_payment_date: nextMonth.toISOString().split('T')[0],
      }));
    }
  }, [payment]);

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

    if (!formData.name.trim()) {
      alert('Te rog să introduci un nume');
      return;
    }

    onSave({
      ...formData,
      amount: amount,
      account_id: formData.account_id || null,
    });
  };

  const predefinedIcons = [
    '💳', '💰', '🏠', '⚡', '📱', '🚗', '🍽️', '🎬', '🏥', '📚',
    '💡', '🌐', '🎵', '📺', '☕', '🏋️', '🎮', '📦', '🛍️', '✈️'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 safe-area-inset-top safe-area-inset-bottom">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {payment ? 'Editează plata recurentă' : 'Adaugă plată recurentă'}
          </h2>
          <button
            onClick={onClose}
            className="touch-target text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nume plată
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-mobile"
              placeholder="Ex: Netflix, Spotify, Chirie"
            />
          </div>

          {/* Amount */}
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
              />
            </div>
          </div>

          {/* Category */}
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

          {/* Account (Optional) */}
          <div>
            <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-2">
              Cont (opțional)
            </label>
            <select
              id="account"
              value={formData.account_id}
              onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
              className="input-mobile appearance-none"
            >
              <option value="">Selectează contul</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Frecvența</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'weekly', label: 'Săptămânal' },
                { value: 'monthly', label: 'Lunar' },
                { value: 'yearly', label: 'Anual' },
                { value: 'daily', label: 'Zilnic' }
              ].map((freq) => (
                <button
                  key={freq.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, frequency: freq.value as any })}
                  className={`p-3 rounded-xl border-2 transition-colors touch-target ${
                    formData.frequency === freq.value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium">{freq.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Next Payment Date */}
          <div>
            <label htmlFor="next_date" className="block text-sm font-medium text-gray-700 mb-2">
              Data următoarei plăți
            </label>
            <div className="relative">
              <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="next_date"
                type="date"
                required
                value={formData.next_payment_date}
                onChange={(e) => setFormData({ ...formData, next_payment_date: e.target.value })}
                className="input-mobile pl-10"
              />
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Selectează iconița
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {predefinedIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`touch-target text-xl rounded-lg border-2 transition-colors ${
                    formData.icon === icon
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
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
              {payment ? 'Actualizează' : 'Adaugă'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RecurringPaymentModal;