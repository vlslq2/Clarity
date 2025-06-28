import React, { useState, useEffect } from 'react';
import { X, Target, DollarSign, Calendar, Tag } from 'lucide-react';
import Card from './Card';

interface BudgetModalProps {
  budget?: any;
  categories: any[];
  onSave: (budget: any) => void;
  onClose: () => void;
}

const BudgetModal: React.FC<BudgetModalProps> = ({
  budget,
  categories,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    category_id: '',
    allocated_amount: '',
    period_type: 'monthly' as 'weekly' | 'monthly' | 'yearly',
    period_start: '',
    period_end: '',
  });

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const monthStart = `${currentMonth}-01`;
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);

    if (budget) {
      setFormData({
        category_id: budget.category_id || '',
        allocated_amount: budget.allocated_amount?.toString() || '',
        period_type: budget.period_type || 'monthly',
        period_start: budget.period_start || monthStart,
        period_end: budget.period_end || monthEnd,
      });
    } else {
      setFormData(prev => ({
        ...prev,
        period_start: monthStart,
        period_end: monthEnd,
      }));
    }
  }, [budget]);

  const handlePeriodTypeChange = (type: 'weekly' | 'monthly' | 'yearly') => {
    const now = new Date();
    let start: string, end: string;

    switch (type) {
      case 'weekly':
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
        start = startOfWeek.toISOString().slice(0, 10);
        end = endOfWeek.toISOString().slice(0, 10);
        break;
      case 'yearly':
        start = `${now.getFullYear()}-01-01`;
        end = `${now.getFullYear()}-12-31`;
        break;
      default: // monthly
        const currentMonth = now.toISOString().slice(0, 7);
        start = `${currentMonth}-01`;
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
    }

    setFormData(prev => ({
      ...prev,
      period_type: type,
      period_start: start,
      period_end: end,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.allocated_amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Te rog să introduci o sumă validă');
      return;
    }

    if (!formData.category_id) {
      alert('Te rog să selectezi o categorie');
      return;
    }

    onSave({
      ...formData,
      allocated_amount: amount,
    });
  };

  const selectedCategory = categories.find(c => c.id === formData.category_id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {budget ? 'Editează bugetul' : 'Creează buget nou'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
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

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Sumă bugetată (RON)
            </label>
            <div className="relative">
              <DollarSign size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.allocated_amount}
                onChange={(e) => setFormData({ ...formData, allocated_amount: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Period Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Perioada</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'weekly', label: 'Săptămânal' },
                { value: 'monthly', label: 'Lunar' },
                { value: 'yearly', label: 'Anual' }
              ].map((period) => (
                <button
                  key={period.value}
                  type="button"
                  onClick={() => handlePeriodTypeChange(period.value as any)}
                  className={`p-3 rounded-xl border-2 transition-colors ${
                    formData.period_type === period.value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-medium">{period.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                Data început
              </label>
              <div className="relative">
                <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="start_date"
                  type="date"
                  required
                  value={formData.period_start}
                  onChange={(e) => setFormData({ ...formData, period_start: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                Data sfârșit
              </label>
              <div className="relative">
                <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="end_date"
                  type="date"
                  required
                  value={formData.period_end}
                  onChange={(e) => setFormData({ ...formData, period_end: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          {selectedCategory && formData.allocated_amount && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Previzualizare:</p>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                  style={{ backgroundColor: selectedCategory.color }}
                >
                  {selectedCategory.icon}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedCategory.name}</p>
                  <p className="text-sm text-gray-600">
                    {parseFloat(formData.allocated_amount).toLocaleString()} RON / {
                      formData.period_type === 'weekly' ? 'săptămână' :
                      formData.period_type === 'monthly' ? 'lună' : 'an'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Anulează
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              {budget ? 'Actualizează' : 'Creează'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BudgetModal;