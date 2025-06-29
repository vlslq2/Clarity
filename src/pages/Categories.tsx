import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Edit2, Trash2 } from 'lucide-react';
import Card from '../components/Card';
import { useCategories } from '../hooks/useCategories';
import { useTransactions } from '../hooks/useTransactions';
import CategoryModal from '../components/CategoryModal';

const Categories: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories();
  const { transactions } = useTransactions();

  // Calculate spending for each category this month
  const currentMonth = new Date().toISOString().slice(0, 7);
  const categoriesWithSpending = categories.map(category => {
    const categoryTransactions = transactions.filter(t => 
      t.category_id === category.id && 
      t.transaction_date.startsWith(currentMonth) &&
      t.type === 'expense'
    );
    
    const spent = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const transactionCount = categoryTransactions.length;
    
    // Fix icon display - if it's not an emoji, use a default
    const displayIcon = category.icon && /\p{Emoji}/u.test(category.icon) ? category.icon : '📦';
    
    return {
      ...category,
      icon: displayIcon,
      spent,
      transactionCount,
      budget: category.budget_limit || 0,
    };
  });

  const totalSpent = categoriesWithSpending.reduce((sum, cat) => sum + cat.spent, 0);
  const totalBudget = categoriesWithSpending.reduce((sum, cat) => sum + cat.budget, 0);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Ești sigur că vrei să ștergi această categorie? Tranzacțiile asociate vor rămâne fără categorie.')) {
      await deleteCategory(id);
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Categorii</h1>
          <p className="text-gray-600 mt-1">Gestionează categoriile și bugetele tale</p>
        </div>
        <button 
          onClick={handleAddCategory}
          className="btn-primary flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" />
          <span className="hidden sm:inline">Adaugă categorie</span>
          <span className="sm:hidden">Adaugă</span>
        </button>
      </div>

      {/* Mobile-optimized Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="text-center p-4">
          <p className="text-sm text-gray-600">Total cheltuit</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{totalSpent.toLocaleString()} RON</p>
          <p className="text-sm text-gray-500 mt-1">din {totalBudget.toLocaleString()} RON bugetat</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-sm text-gray-600">Utilizare medie</p>
          <p className="text-xl sm:text-2xl font-bold text-indigo-600 mt-1">
            {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
          </p>
          <p className="text-sm text-gray-500 mt-1">din bugetul total</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-sm text-gray-600">Categorii active</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">{categories.length}</p>
          <p className="text-sm text-gray-500 mt-1">categorii create</p>
        </Card>
      </div>

      {/* Mobile-optimized Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categoriesWithSpending.length > 0 ? (
          categoriesWithSpending.map((category) => (
            <Card key={category.id} hover className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center flex-1 min-w-0">
                  <div className="text-2xl mr-3 flex-shrink-0">{category.icon}</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.transactionCount} tranzacții</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button 
                    onClick={() => handleEditCategory(category)}
                    className="touch-target text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  {!category.is_default && (
                    <button 
                      onClick={() => handleDeleteCategory(category.id)}
                      className="touch-target text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cheltuit</span>
                  <span className="font-semibold text-gray-900">{category.spent.toLocaleString()} RON</span>
                </div>
                
                {category.budget > 0 && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((category.spent / category.budget) * 100, 100)}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {Math.round((category.spent / category.budget) * 100)}% din {category.budget.toLocaleString()} RON
                      </span>
                      <div className={`flex items-center text-xs ${
                        category.spent > category.budget ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {category.spent > category.budget ? 
                          <TrendingUp size={12} className="mr-1" /> : 
                          <TrendingDown size={12} className="mr-1" />
                        }
                        {category.spent > category.budget ? 'Depășit' : 'În buget'}
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-xs text-gray-500">
                        Rămase: {Math.max(category.budget - category.spent, 0).toLocaleString()} RON
                      </p>
                    </div>
                  </>
                )}
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 px-4">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg">Nu ai încă categorii</p>
            <p className="text-sm text-gray-400 mt-1">Adaugă prima ta categorie pentru a organiza cheltuielile</p>
            <button 
              onClick={handleAddCategory}
              className="mt-4 btn-primary"
            >
              Adaugă prima categorie
            </button>
          </div>
        )}
      </div>

      {/* Category Modal */}
      {showModal && (
        <CategoryModal
          category={editingCategory}
          onSave={async (categoryData) => {
            if (editingCategory) {
              await updateCategory(editingCategory.id, categoryData);
            } else {
              await addCategory(categoryData);
            }
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Categories;