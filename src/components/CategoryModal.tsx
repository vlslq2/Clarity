import React, { useState, useEffect } from 'react';
import { X, Tag, Palette, DollarSign } from 'lucide-react';
import Card from './Card';

interface CategoryModalProps {
  category?: any;
  onSave: (category: any) => void;
  onClose: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  category,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: '📦',
    color: '#6B7280',
    budget_limit: '',
  });

  const predefinedIcons = [
    '🍽️', '🚗', '🛍️', '🎬', '💡', '🏥', '📚', '🏠', '👕', '📱',
    '✈️', '💰', '⚽', '🎵', '🍕', '☕', '🚌', '💊', '🎮', '📦'
  ];

  const predefinedColors = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
    '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
    '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#6B7280'
  ];

  const categoryNameSuggestions = [
    'Mâncare și băuturi',
    'Transport',
    'Cumpărături',
    'Divertisment',
    'Utilități',
    'Sănătate',
    'Educație',
    'Casa și grădina',
    'Îmbrăcăminte',
    'Tehnologie',
    'Sport și fitness',
    'Călătorii',
    'Cadouri',
    'Servicii financiare',
    'Animale de companie',
    'Frumusețe și îngrijire',
    'Hobby-uri',
    'Subscripții',
    'Taxe și impozite',
    'Donații'
  ];

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        icon: category.icon || '📦',
        color: category.color || '#6B7280',
        budget_limit: category.budget_limit ? category.budget_limit.toString() : '',
      });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Te rog să introduci un nume pentru categorie');
      return;
    }

    onSave({
      ...formData,
      budget_limit: formData.budget_limit ? parseFloat(formData.budget_limit) : null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 safe-area-inset-top safe-area-inset-bottom">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {category ? 'Editează categoria' : 'Adaugă categorie nouă'}
          </h2>
          <button
            onClick={onClose}
            className="touch-target text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name with suggestions */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nume categorie
            </label>
            <div className="relative">
              <Tag size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-mobile pl-10"
                placeholder="Ex: Mâncare și băuturi"
                list="category-suggestions"
                autoComplete="off"
              />
              <datalist id="category-suggestions">
                {categoryNameSuggestions.map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Începe să scrii pentru a vedea sugestii de categorii
            </p>
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

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Selectează culoarea
            </label>
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-lg border-2 transition-all touch-target ${
                    formData.color === color
                      ? 'border-gray-800 scale-110'
                      : 'border-gray-200 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Budget Limit */}
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
              Limită buget lunară (opțional)
            </label>
            <div className="relative">
              <DollarSign size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="budget"
                type="number"
                step="0.01"
                min="0"
                value={formData.budget_limit}
                onChange={(e) => setFormData({ ...formData, budget_limit: e.target.value })}
                className="input-mobile pl-10"
                placeholder="0.00"
                autoComplete="off"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Lasă gol dacă nu vrei să setezi o limită de buget
            </p>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Previzualizare:</p>
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                style={{ backgroundColor: formData.color }}
              >
                {formData.icon}
              </div>
              <div>
                <p className="font-medium text-gray-900">{formData.name || 'Nume categorie'}</p>
                {formData.budget_limit && (
                  <p className="text-sm text-gray-600">
                    Buget: {parseFloat(formData.budget_limit).toLocaleString()} RON/lună
                  </p>
                )}
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
              {category ? 'Actualizează' : 'Adaugă'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CategoryModal;