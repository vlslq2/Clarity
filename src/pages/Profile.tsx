import React from 'react';
import { Edit2, CreditCard, Building, Shield, Bell } from 'lucide-react';
import Card from '../components/Card';

const Profile: React.FC = () => {
  const accounts = [
    {
      id: '1',
      name: 'Cont Principal BRD',
      type: 'checking',
      balance: 8450.30,
      currency: 'RON',
      connected: true,
      lastSync: '2025-01-15 10:30'
    },
    {
      id: '2',
      name: 'Cont Economii ING',
      type: 'savings',
      balance: 15750.00,
      currency: 'RON',
      connected: true,
      lastSync: '2025-01-15 09:15'
    },
    {
      id: '3',
      name: 'Card Credit BCR',
      type: 'credit',
      balance: -2340.50,
      currency: 'RON',
      connected: false,
      lastSync: '2025-01-10 14:20'
    }
  ];

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'checking': return 'Cont Curent';
      case 'savings': return 'Cont Economii';
      case 'credit': return 'Card Credit';
      default: return type;
    }
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking': return '🏦';
      case 'savings': return '💰';
      case 'credit': return '💳';
      default: return '🏛️';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profil și Conturi</h1>
          <p className="text-gray-600 mt-1">Gestionează informațiile tale personale și conturile bancare</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">MR</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Maria Rădulescu</h2>
              <p className="text-gray-600">maria.radulescu@email.com</p>
              <p className="text-sm text-gray-500 mt-1">Membru din Ianuarie 2024</p>
            </div>
            
            <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center">
              <Edit2 size={20} className="mr-2" />
              Editează Profilul
            </button>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Statistici Rapide</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Conturi conectate</span>
                <span className="font-semibold text-gray-900">2 din 3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tranzacții luna aceasta</span>
                <span className="font-semibold text-gray-900">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Categorii utilizate</span>
                <span className="font-semibold text-gray-900">6</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Documente procesate</span>
                <span className="font-semibold text-gray-900">24</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Accounts and Settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Bank Accounts */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Conturi Bancare</h2>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
                <CreditCard size={16} className="mr-1" />
                Adaugă Cont
              </button>
            </div>
            
            <div className="space-y-4">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">{getAccountIcon(account.type)}</div>
                    <div>
                      <h3 className="font-medium text-gray-900">{account.name}</h3>
                      <p className="text-sm text-gray-600">{getAccountTypeLabel(account.type)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Ultima sincronizare: {account.lastSync}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${
                      account.balance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {account.balance >= 0 ? '+' : ''}{account.balance.toLocaleString()} {account.currency}
                    </p>
                    <div className="flex items-center mt-1">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        account.connected ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className={`text-xs ${
                        account.connected ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {account.connected ? 'Conectat' : 'Deconectat'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Settings Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Security Settings */}
            <Card>
              <div className="flex items-center mb-4">
                <Shield size={24} className="text-indigo-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Securitate</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Autentificare cu două factori</p>
                    <p className="text-xs text-gray-600">Protecție suplimentară pentru cont</p>
                  </div>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" />
                    <div className="w-10 h-6 bg-green-500 rounded-full shadow-inner">
                      <div className="w-4 h-4 bg-white rounded-full shadow translate-x-5 transition-transform duration-300 ease-in-out transform mt-1"></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Notificări de securitate</p>
                    <p className="text-xs text-gray-600">Alertă pentru activitate suspectă</p>
                  </div>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" />
                    <div className="w-10 h-6 bg-green-500 rounded-full shadow-inner">
                      <div className="w-4 h-4 bg-white rounded-full shadow translate-x-5 transition-transform duration-300 ease-in-out transform mt-1"></div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full text-left text-sm text-indigo-600 hover:text-indigo-700 py-2">
                  Schimbă parola →
                </button>
              </div>
            </Card>

            {/* Notification Settings */}
            <Card>
              <div className="flex items-center mb-4">
                <Bell size={24} className="text-indigo-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Notificări</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Tranzacții noi</p>
                    <p className="text-xs text-gray-600">Alertă pentru fiecare tranzacție</p>
                  </div>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" />
                    <div className="w-10 h-6 bg-green-500 rounded-full shadow-inner">
                      <div className="w-4 h-4 bg-white rounded-full shadow translate-x-5 transition-transform duration-300 ease-in-out transform mt-1"></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Depășire buget</p>
                    <p className="text-xs text-gray-600">Alertă când bugetul este depășit</p>
                  </div>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" />
                    <div className="w-10 h-6 bg-green-500 rounded-full shadow-inner">
                      <div className="w-4 h-4 bg-white rounded-full shadow translate-x-5 transition-transform duration-300 ease-in-out transform mt-1"></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Rapoarte lunare</p>
                    <p className="text-xs text-gray-600">Sumar lunar prin email</p>
                  </div>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" />
                    <div className="w-10 h-6 bg-gray-300 rounded-full shadow-inner">
                      <div className="w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ease-in-out transform mt-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Company Settings (for teams) */}
          <Card>
            <div className="flex items-center mb-4">
              <Building size={24} className="text-indigo-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Setări Echipă</h3>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-gray-600 mb-3">Actualizează la planul Business pentru funcții de echipă</p>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Actualizează Planul
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;