import React, { useState } from 'react';
import { 
  Home, 
  CreditCard, 
  PieChart, 
  Calendar, 
  Menu,
  X,
  Repeat,
  LogOut,
  Tag,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, user } = useAuth();

  const navigationItems = [
    { id: 'dashboard', label: 'Acasă', icon: Home },
    { id: 'transactions', label: 'Tranzacții', icon: CreditCard },
    { id: 'budgets', label: 'Bugete', icon: PieChart },
    { id: 'categories', label: 'Categorii', icon: Tag },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'recurring', label: 'Recurring', icon: Repeat },
    { id: 'reports', label: 'Rapoarte', icon: BarChart3 },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 safe-area-inset-top">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Clarity</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center transition-colors active:bg-gray-200"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-out
          safe-area-inset-left
        `}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-center h-20 px-6 border-b border-gray-200 safe-area-inset-top">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Clarity</h1>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 px-6 py-6 space-y-2 overflow-y-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                      ${isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon size={20} className="mr-3" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Info & Sign Out */}
            <div className="p-6 border-t border-gray-200 safe-area-inset-bottom">
              <div className="flex items-center space-x-3 mb-4 p-3 rounded-xl bg-gray-50">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.user_metadata?.full_name || 'Utilizator'}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <LogOut size={16} className="mr-3" />
                Deconectează-te
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <main className="px-4 py-6 lg:px-8 max-w-7xl mx-auto safe-area-inset-bottom">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;