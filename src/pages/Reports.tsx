import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar, Filter } from 'lucide-react';
import Card from '../components/Card';

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const chartData = {
    monthly: [
      { month: 'Ian', income: 4500, expenses: 3200 },
      { month: 'Feb', income: 4500, expenses: 2800 },
      { month: 'Mar', income: 4500, expenses: 3400 },
      { month: 'Apr', income: 4500, expenses: 2900 },
      { month: 'Mai', income: 4500, expenses: 3100 },
      { month: 'Iun', income: 4500, expenses: 3300 },
    ],
    categories: [
      { name: 'Mâncare', amount: 850, color: '#EF4444', percentage: 35 },
      { name: 'Transport', amount: 420, color: '#3B82F6', percentage: 17 },
      { name: 'Divertisment', amount: 180, color: '#8B5CF6', percentage: 7 },
      { name: 'Cumpărături', amount: 650, color: '#F59E0B', percentage: 27 },
      { name: 'Utilități', amount: 320, color: '#10B981', percentage: 13 },
    ]
  };

  const insights = [
    {
      title: 'Cea mai mare cheltuială',
      value: 'Mâncare - 850 RON',
      change: '+15% față de luna trecută',
      type: 'warning'
    },
    {
      title: 'Cea mai mică cheltuială',
      value: 'Divertisment - 180 RON',
      change: '-5% față de luna trecută',
      type: 'success'
    },
    {
      title: 'Trend general',
      value: 'Cheltuieli în scădere',
      change: '-8% față de luna trecută',
      type: 'success'
    },
    {
      title: 'Obiectiv lunar',
      value: 'Atins 85%',
      change: 'Rămân 450 RON',
      type: 'info'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapoarte și Analize</h1>
          <p className="text-gray-600 mt-1">Obține perspective detaliate asupra cheltuielilor tale</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center">
          <Download size={20} className="mr-2" />
          Exportă Raport
        </button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Calendar size={20} className="text-gray-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="week">Săptămâna aceasta</option>
              <option value="month">Luna aceasta</option>
              <option value="quarter">Trimestrul acesta</option>
              <option value="year">Anul acesta</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Toate categoriile</option>
              <option value="food">Mâncare</option>
              <option value="transport">Transport</option>
              <option value="entertainment">Divertisment</option>
              <option value="shopping">Cumpărături</option>
              <option value="utilities">Utilități</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <Card key={index} hover>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">{insight.title}</p>
              <p className="text-lg font-bold text-gray-900 mt-2">{insight.value}</p>
              <p className={`text-sm mt-1 ${
                insight.type === 'success' ? 'text-green-600' :
                insight.type === 'warning' ? 'text-yellow-600' :
                insight.type === 'info' ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {insight.change}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income vs Expenses Chart */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Venituri vs Cheltuieli</h2>
            <BarChart3 size={24} className="text-indigo-600" />
          </div>
          
          <div className="space-y-4">
            {chartData.monthly.map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{data.month}</span>
                  <div className="text-sm text-gray-600">
                    <span className="text-green-600">+{data.income}</span> / 
                    <span className="text-red-600 ml-1">-{data.expenses}</span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="relative h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500 h-full"
                        style={{ width: `${(data.income / 5000) * 100}%` }}
                      />
                      <div 
                        className="bg-red-500 h-full absolute top-0"
                        style={{ 
                          width: `${(data.expenses / 5000) * 100}%`,
                          left: `${(data.income / 5000) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Cheltuieli pe Categorii</h2>
            <PieChart size={24} className="text-indigo-600" />
          </div>
          
          <div className="space-y-4">
            {chartData.categories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {category.amount} RON ({category.percentage}%)
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${category.percentage}%`,
                      backgroundColor: category.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Statistici Detaliate</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <TrendingUp size={32} className="text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Cea mai bună lună</p>
            <p className="text-lg font-bold text-green-600">Februarie</p>
            <p className="text-sm text-gray-500">+1,200 RON economisit</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <BarChart3 size={32} className="text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Medie zilnică</p>
            <p className="text-lg font-bold text-blue-600">106 RON</p>
            <p className="text-sm text-gray-500">cheltuieli</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <PieChart size={32} className="text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Tranzacții</p>
            <p className="text-lg font-bold text-purple-600">247</p>
            <p className="text-sm text-gray-500">în ultimele 30 zile</p>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <TrendingUp size={32} className="text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Rata de economisire</p>
            <p className="text-lg font-bold text-yellow-600">28%</p>
            <p className="text-sm text-gray-500">din venituri</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;