import React, { useState } from 'react';
import { Plus, Target, TrendingUp, TrendingDown, Calendar, Edit2, Trash2 } from 'lucide-react';
import Card from '../components/Card';
import { useBudgets } from '../hooks/useBudgets';
import { useCategories } from '../hooks/useCategories';
import BudgetModal from '../components/BudgetModal';

const Budgets: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);

  const { budgets, budgetSummaries, loading, addBudget, updateBudget, deleteBudget } = useBudgets();
  const { categories } = useCategories();

  const totalAllocated = budgetSummaries.reduce((sum, budget) => sum + budget.allocated_amount, 0);
  const totalSpent = budgetSummaries.reduce((sum, budget) => sum + budget.spent_amount, 0);
  const remainingBudget = totalAllocated - totalSpent;

  const getStatusColor = (spent: number, allocated: number) => {
    const percentage = (spent / allocated) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = (spent: number, allocated: number) => {
    const percentage = (spent / allocated) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleAddBudget = () => {
    setEditingBudget(null);
    setShowModal(true);
  };

  const handleEditBudget = (budget: any) => {
    setEditingBudget(budget);
    setShowModal(true);
  };

  const handleDeleteBudget = async (id: string) => {
    if (window.confirm('Ești sigur că vrei să ștergi acest buget?')) {
      await deleteBudget(id);
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bugete</h1>
          <p className="text-gray-600 mt-1">Urmărește și gestionează bugetele tale pe categorii</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-mobile"
          >
            <option value="week">Săptămâna aceasta</option>
            <option value="month">Luna aceasta</option>
            <option value="year">Anul acesta</option>
          </select>
          <button 
            onClick={handleAddBudget}
            className="btn-primary flex items-center justify-center"
          >
            <Plus size={20} className="mr-2" />
            <span className="hidden sm:inline">Buget nou</span>
            <span className="sm:hidden">Adaugă</span>
          </button>
        </div>
      </div>

      {/* Mobile-optimized Budget Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="text-center p-4">
          <p className="text-xs sm:text-sm text-gray-600">Total bugetat</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{totalAllocated.toLocaleString()} RON</p>
          <p className="text-xs text-gray-500 mt-1">pentru această lună</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-xs sm:text-sm text-gray-600">Total cheltuit</p>
          <p className="text-lg sm:text-2xl font-bold text-indigo-600 mt-1">{totalSpent.toLocaleString()} RON</p>
          <p className="text-xs text-gray-500 mt-1">
            {totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0}% din buget
          </p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-xs sm:text-sm text-gray-600">Rămâne</p>
          <p className={`text-lg sm:text-2xl font-bold mt-1 ${getStatusColor(totalSpent, totalAllocated)}`}>
            {remainingBudget.toLocaleString()} RON
          </p>
          <p className="text-xs text-gray-500 mt-1">până la sfârșitul lunii</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-xs sm:text-sm text-gray-600">Bugete active</p>
          <p className="text-lg sm:text-2xl font-bold text-purple-600 mt-1">{budgetSummaries.length}</p>
          <p className="text-xs text-gray-500 mt-1">categorii cu bugete</p>
        </Card>
      </div>

      {/* Budget Progress */}
      {totalAllocated > 0 && (
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Progres general</h2>
            <div className="text-sm text-gray-600">
              {Math.round((totalSpent / totalAllocated) * 100)}% utilizat
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className={`h-4 rounded-full transition-all duration-300 ${getProgressColor(totalSpent, totalAllocated)}`}
              style={{ width: `${Math.min((totalSpent / totalAllocated) * 100, 100)}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>0 RON</span>
            <span>{totalAllocated.toLocaleString()} RON</span>
          </div>
        </Card>
      )}

      {/* Individual Budgets - Mobile optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {budgetSummaries.length > 0 ? (
          budgetSummaries.map((budget) => (
            <Card key={budget.id} hover className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center flex-1 min-w-0">
                  <div className="text-2xl mr-3 flex-shrink-0">{budget.category_icon}</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">{budget.category_name}</h3>
                    <p className="text-sm text-gray-600">{budget.transaction_count} tranzacții</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className={`flex items-center text-xs ${
                    budget.utilization_percentage > 100 ? 'text-red-600' : 
                    budget.utilization_percentage > 75 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {budget.utilization_percentage > 100 ? 
                      <TrendingUp size={12} className="mr-1" /> : 
                      <TrendingDown size={12} className="mr-1" />
                    }
                    {Math.round(budget.utilization_percentage)}%
                  </div>
                  <button 
                    onClick={() => handleEditBudget(budget)}
                    className="touch-target text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDeleteBudget(budget.id)}
                    className="touch-target text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Progres</span>
                  <span className="font-semibold text-gray-900 text-sm">
                    {budget.spent_amount.toLocaleString()} / {budget.allocated_amount.toLocaleString()} RON
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(budget.utilization_percentage, 100)}%`,
                      backgroundColor: budget.category_color
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Rămâne</p>
                    <p className={`font-semibold ${getStatusColor(budget.spent_amount, budget.allocated_amount)}`}>
                      {budget.remaining_amount.toLocaleString()} RON
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Medie zilnică</p>
                    <p className="font-semibold text-gray-900">
                      {budget.transaction_count > 0 ? 
                        (budget.spent_amount / new Date().getDate()).toFixed(2) : '0.00'
                      } RON
                    </p>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {Math.round(budget.utilization_percentage)}% utilizat
                    </span>
                    <span className="text-xs text-gray-500">
                      {budget.period_start} - {budget.period_end}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 px-4">
            <Target size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Nu ai încă bugete configurate</p>
            <p className="text-sm text-gray-400 mt-1">Creează primul tău buget pentru a urmări cheltuielile pe categorii</p>
            <button 
              onClick={handleAddBudget}
              className="mt-4 btn-primary"
            >
              Creează primul buget
            </button>
          </div>
        )}
      </div>

      {/* Budget Modal */}
      {showModal && (
        <BudgetModal
          budget={editingBudget}
          categories={categories}
          onSave={async (budgetData) => {
            if (editingBudget) {
              await updateBudget(editingBudget.id, budgetData);
            } else {
              await addBudget(budgetData);
            }
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Budgets;