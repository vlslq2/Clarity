import React, { useState, useEffect } from 'react';
import { X, CreditCard, DollarSign, Building } from 'lucide-react';
import Card from './Card';

interface AccountModalProps {
  account?: any;
  onSave: (account: any) => void;
  onClose: () => void;
}

const AccountModal: React.FC<AccountModalProps> = ({
  account,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'checking' as 'checking' | 'savings' | 'credit' | 'investment',
    balance: '',
    currency: 'RON',
    is_connected: false,
  });

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name || '',
        type: account.type || 'checking',
        balance: account.balance?.toString() || '',
        currency: account.currency || 'RON',
        is_connected: account.is_connected || false,
      });
    }
  }, [account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Te rog să introduci un nume pentru cont');
      return;
    }

    const balance = parseFloat(formData.balance) || 0;

    onSave({
      ...formData,
      balance,
    });
  };

  const accountTypes = [
    { value: 'checking', label: 'Cont Curent', icon: '🏦' },
    { value: 'savings', label: 'Cont Economii', icon: '💰' },
    { value: 'credit', label: 'Card Credit', icon: '💳' },
    { value: 'investment', label: 'Investiții', icon: '📈' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 safe-area-inset-top safe-area-inset-bottom">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {account ? 'Editează contul' : 'Adaugă cont nou'}
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
              Nume cont
            </label>
            <div className="relative">
              <Building size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-mobile pl-10"
                placeholder="Ex: Cont Principal BRD"
              />
            </div>
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Tip cont</label>
            <div className="grid grid-cols-2 gap-3">
              {accountTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value as any })}
                  className={`p-3 rounded-xl border-2 transition-colors touch-target ${
                    formData.type === type.value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Balance */}
          <div>
            <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-2">
              Sold inițial (RON)
            </label>
            <div className="relative">
              <DollarSign size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="balance"
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                className="input-mobile pl-10"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Currency */}
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
              Monedă
            </label>
            <select
              id="currency"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="input-mobile appearance-none"
            >
              <option value="RON">Leu românesc (RON)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="USD">Dolar american (USD)</option>
              <option value="GBP">Liră sterlină (GBP)</option>
            </select>
          </div>

          {/* Connected Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Cont conectat</p>
              <p className="text-xs text-gray-600">Sincronizare automată cu banca</p>
            </div>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={formData.is_connected}
                onChange={(e) => setFormData({ ...formData, is_connected: e.target.checked })}
              />
              <div 
                className={`w-10 h-6 rounded-full shadow-inner cursor-pointer transition-colors ${
                  formData.is_connected ? 'bg-indigo-500' : 'bg-gray-300'
                }`}
                onClick={() => setFormData({ ...formData, is_connected: !formData.is_connected })}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ease-in-out transform mt-1 ${
                  formData.is_connected ? 'translate-x-5' : 'translate-x-1'
                }`}></div>
              </div>
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
              {account ? 'Actualizează' : 'Adaugă'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AccountModal;