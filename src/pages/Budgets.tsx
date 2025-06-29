import React, { useState } from 'react';
import { Plus, Target, Calendar, Edit2, Trash2, TrendingUp } from 'lucide-react';
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
          <h1 className="text-2xl font-bold text-gray-900">Bugete</h1>
          <p className="text-gray-600 mt-1">Urmărește și gestionează bugetele tale</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            <option value="week">Săptămâna aceasta</option>
            <option value="month">Luna aceasta</option>
            <option value="year">Anul acesta</option>
          </select>
          <button 
            onClick={handleAddBudget}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
          >
            <Plus size={20} className="mr-2" />
            Buget nou
          </button>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-3">
            <Target size={24} className="text-blue-600" />
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Total bugetat</p>
          <p className="text-2xl font-bold text-gray-900">
            {totalAllocated.toLocaleString('ro-RO')} RON
          </p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mx-auto mb-3">
            <TrendingUp size={24} className="text-indigo-600" />
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Total cheltuit</p>
          <p className="text-2xl font-bold text-indigo-600">
            {totalSpent.toLocaleString('ro-RO')} RON
          </p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3">
            <div className="w-6 h-6 bg-green-600 rounded-full"></div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Rămâne</p>
          <p className="text-2xl font-bold text-green-600">
            {remainingBudget.toLocaleString('ro-RO')} RON
          </p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-3">
            <Calendar size={24} className="text-purple-600" />
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Bugete active</p>
          <p className="text-2xl font-bold text-purple-600">{budgetSummaries.length}</p>
        </Card>
      </div>

      {/* Budget Progress */}
      {totalAllocated > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Progres general</h2>
            <div className="text-sm font-medium text-gray-600">
              {Math.round((totalSpent / totalAllocated) * 100)}% utilizat
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="h-4 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300"
              style={{ width: `${Math.min((totalSpent / totalAllocated) * 100, 100)}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>0 RON</span>
            <span>{totalAllocated.toLocaleString('ro-RO')} RON</span>
          </div>
        </Card>
      )}

      {/* Individual Budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budgetSummaries.length > 0 ? (
          budgetSummaries.map((budget) => (
            <Card key={budget.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl"
                    style={{ backgroundColor: budget.category_color }}
                  >
                    {budget.category_icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{budget.category_name}</h3>
                    <p className="text-sm text-gray-600">{budget.transaction_count} tranzacții</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleEditBudget(budget)}
                    className="w-8 h-8 flex items-center justify-center text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteBudget(budget.id)}
                    className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Progres</span>
                  <span className="font-semibold text-gray-900">
                    {budget.spent_amount.toLocaleString('ro-RO')} / {budget.allocated_amount.toLocaleString('ro-RO')} RON
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rămâne</p>
                    <p className="text-lg font-semibold text-green-600">
                      {budget.remaining_amount.toLocaleString('ro-RO')} RON
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Utilizare</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {Math.round(budget.utilization_percentage)}%
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">Nu ai încă bugete configurate</p>
            <p className="text-sm text-gray-400 mt-1">Creează primul tău buget pentru a urmări cheltuielile</p>
            <button 
              onClick={handleAddBudget}
              className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
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