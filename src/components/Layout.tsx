import React, { useState } from 'react';
import { 
  Home, 
  CreditCard, 
  PieChart, 
  Calendar, 
  Upload, 
  Settings, 
  User,
  Menu,
  X,
  Repeat,
  LogOut,
  Tag,
  Sparkles
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
    { id: 'upload', label: 'Încărcare', icon: Upload },
    { id: 'reports', label: 'Rapoarte', icon: PieChart },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'settings', label: 'Setări', icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Enhanced Mobile Header */}
      <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b-2 border-gray-200/80 px-4 py-3 flex items-center justify-between sticky top-0 z-40 safe-area-inset-top shadow-lg shadow-gray-900/10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
            <Sparkles size={16} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gradient">
            Clarity
          </h1>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-white/90 transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg border-2 border-gray-200/60 hover:border-gray-300/80"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Enhanced Sidebar with better contrast */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl border-r-2 border-gray-200/80 transform shadow-2xl shadow-gray-900/20
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-out
          safe-area-inset-left
        `}>
          <div className="flex flex-col h-full">
            {/* Enhanced Logo with better contrast */}
            <div className="flex items-center justify-center h-20 px-6 border-b-2 border-gray-200/80 safe-area-inset-top bg-gradient-to-r from-white to-gray-50/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-500/20">
                  <Sparkles size={20} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gradient">
                  Clarity
                </h1>
              </div>
            </div>
            
            {/* Enhanced Navigation with better contrast */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
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
                      w-full flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 group border-2
                      ${isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02] border-indigo-500/30'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/80 hover:shadow-md active:scale-[0.98] border-transparent hover:border-gray-200/60'
                      }
                    `}
                  >
                    <Icon size={20} className={`mr-3 flex-shrink-0 transition-transform duration-200 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`} />
                    <span className="truncate">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse shadow-sm"></div>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Enhanced User Info & Sign Out with better contrast */}
            <div className="p-4 border-t-2 border-gray-200/80 safe-area-inset-bottom bg-gradient-to-r from-white to-gray-50/50">
              <div className="flex items-center space-x-3 mb-4 p-3 rounded-xl bg-gradient-to-r from-white to-indigo-50/60 backdrop-blur-sm border-2 border-gray-200/60 shadow-md shadow-gray-900/10">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border border-indigo-500/20">
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
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/80 rounded-xl transition-all duration-200 active:scale-[0.98] hover:shadow-md group border-2 border-transparent hover:border-gray-200/60"
              >
                <LogOut size={16} className="mr-3 group-hover:scale-110 transition-transform duration-200" />
                Deconectează-te
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <main className="px-4 py-6 lg:px-8 max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Enhanced Mobile Sidebar Overlay with better contrast */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;