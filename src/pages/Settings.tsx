import React, { useState } from 'react';
import { 
  Globe, 
  Palette, 
  CreditCard, 
  Shield, 
  Bell, 
  Download, 
  Trash2, 
  HelpCircle,
  Moon,
  Sun,
  Save
} from 'lucide-react';
import Card from '../components/Card';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';

const Settings: React.FC = () => {
  const { profile, updateProfile } = useProfile();
  const { signOut } = useAuth();
  
  const [settings, setSettings] = useState({
    darkMode: false,
    currency: profile?.currency || 'RON',
    language: profile?.language || 'ro',
    dateFormat: 'dd/mm/yyyy',
    resetBudgets: true,
    budgetAlerts: true,
    autoCategories: true,
    pinLock: false,
    dataSync: true,
    analytics: true,
    transactionNotifications: true,
    budgetNotifications: true,
    monthlyReports: false,
  });

  const [saving, setSaving] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Update profile settings
      await updateProfile({
        currency: settings.currency,
        language: settings.language,
      });
      
      // Here you would typically save other settings to a user preferences table
      // For now, we'll just simulate the save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Setările au fost salvate cu succes!');
    } catch (error) {
      alert('Eroare la salvarea setărilor');
    } finally {
      setSaving(false);
    }
  };

  const exportData = async () => {
    try {
      // This would typically call an API endpoint to generate and download user data
      alert('Exportul datelor va fi disponibil în curând');
    } catch (error) {
      alert('Eroare la exportul datelor');
    }
  };

  const deleteAllData = async () => {
    if (window.confirm('Ești sigur că vrei să ștergi toate datele? Această acțiune nu poate fi anulată.')) {
      if (window.confirm('Confirmă din nou - toate tranzacțiile, bugetele și setările vor fi șterse permanent.')) {
        try {
          // This would call an API to delete all user data
          alert('Funcția de ștergere va fi implementată în curând');
        } catch (error) {
          alert('Eroare la ștergerea datelor');
        }
      }
    }
  };

  const closeAccount = async () => {
    if (window.confirm('Ești sigur că vrei să închizi contul? Toate datele vor fi șterse și nu vei mai putea accesa aplicația.')) {
      if (window.confirm('Confirmă din nou - contul va fi închis permanent.')) {
        try {
          // This would call an API to close the account
          await signOut();
        } catch (error) {
          alert('Eroare la închiderea contului');
        }
      }
    }
  };

  const settingsSections = [
    {
      title: 'Aspect și Limba',
      icon: Palette,
      settings: [
        {
          label: 'Mod Întunecat',
          description: 'Comută între temele luminoasă și întunecată',
          type: 'toggle',
          key: 'darkMode'
        },
        {
          label: 'Limbă',
          description: 'Schimbă limba aplicației',
          type: 'select',
          key: 'language',
          options: [
            { value: 'ro', label: 'Română' },
            { value: 'en', label: 'English' },
            { value: 'fr', label: 'Français' }
          ]
        }
      ]
    },
    {
      title: 'Monedă și Regiune',
      icon: Globe,
      settings: [
        {
          label: 'Moneda Principală',
          description: 'Moneda utilizată pentru afișarea sumelor',
          type: 'select',
          key: 'currency',
          options: [
            { value: 'RON', label: 'Leu românesc (RON)' },
            { value: 'EUR', label: 'Euro (EUR)' },
            { value: 'USD', label: 'Dolar american (USD)' },
            { value: 'GBP', label: 'Liră sterlină (GBP)' }
          ]
        },
        {
          label: 'Format Dată',
          description: 'Cum sunt afișate datele în aplicație',
          type: 'select',
          key: 'dateFormat',
          options: [
            { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY' },
            { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY' },
            { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD' }
          ]
        }
      ]
    },
    {
      title: 'Bugete și Categorii',
      icon: CreditCard,
      settings: [
        {
          label: 'Resetare Bugete Lunare',
          description: 'Resetează automat bugetele la începutul fiecărei luni',
          type: 'toggle',
          key: 'resetBudgets'
        },
        {
          label: 'Alertă Depășire Buget',
          description: 'Primește notificări când bugetul este depășit',
          type: 'toggle',
          key: 'budgetAlerts'
        },
        {
          label: 'Categorizare Automată',
          description: 'Categorizează automat tranzacțiile similare',
          type: 'toggle',
          key: 'autoCategories'
        }
      ]
    },
    {
      title: 'Securitate și Confidențialitate',
      icon: Shield,
      settings: [
        {
          label: 'Blocare cu PIN',
          description: 'Solicită PIN pentru accesarea aplicației',
          type: 'toggle',
          key: 'pinLock'
        },
        {
          label: 'Sincronizare Date',
          description: 'Sincronizează datele între dispozitive',
          type: 'toggle',
          key: 'dataSync'
        },
        {
          label: 'Analitice Anonime',
          description: 'Ajută la îmbunătățirea aplicației prin date anonime',
          type: 'toggle',
          key: 'analytics'
        }
      ]
    },
    {
      title: 'Notificări',
      icon: Bell,
      settings: [
        {
          label: 'Tranzacții Noi',
          description: 'Alertă pentru fiecare tranzacție nouă',
          type: 'toggle',
          key: 'transactionNotifications'
        },
        {
          label: 'Depășire Buget',
          description: 'Alertă când bugetul este depășit',
          type: 'toggle',
          key: 'budgetNotifications'
        },
        {
          label: 'Rapoarte Lunare',
          description: 'Sumar lunar prin email',
          type: 'toggle',
          key: 'monthlyReports'
        }
      ]
    }
  ];

  const renderSettingControl = (setting: any) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={settings[setting.key as keyof typeof settings] as boolean}
              onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
            />
            <div 
              className={`w-10 h-6 rounded-full shadow-inner cursor-pointer transition-colors ${
                settings[setting.key as keyof typeof settings] ? 'bg-indigo-500' : 'bg-gray-300'
              }`}
              onClick={() => handleSettingChange(setting.key, !settings[setting.key as keyof typeof settings])}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ease-in-out transform mt-1 ${
                settings[setting.key as keyof typeof settings] ? 'translate-x-5' : 'translate-x-1'
              }`}></div>
            </div>
          </div>
        );
      case 'select':
        return (
          <select
            value={settings[setting.key as keyof typeof settings] as string}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            {setting.options?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Setări</h1>
          <p className="text-gray-600 mt-1">Personalizează experiența Clarity după preferințele tale</p>
        </div>
        <button 
          onClick={saveSettings}
          disabled={saving}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50"
        >
          <Save size={20} className="mr-2" />
          {saving ? 'Se salvează...' : 'Salvează Setările'}
        </button>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => {
          const Icon = section.icon;
          return (
            <Card key={sectionIndex}>
              <div className="flex items-center mb-6">
                <Icon size={24} className="text-indigo-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
              </div>
              
              <div className="space-y-6">
                {section.settings.map((setting, settingIndex) => (
                  <div key={settingIndex} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{setting.label}</p>
                      <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                    </div>
                    <div className="ml-6">
                      {renderSettingControl(setting)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center mb-4">
            <Download size={24} className="text-green-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Export Date</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Descarcă toate datele tale într-un format CSV sau JSON
          </p>
          <button 
            onClick={exportData}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            Exportă Datele
          </button>
        </Card>

        <Card>
          <div className="flex items-center mb-4">
            <HelpCircle size={24} className="text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Ajutor și Suport</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Accesează documentația sau contactează echipa de suport
          </p>
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
            Centrul de Ajutor
          </button>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card>
        <div className="flex items-center mb-4">
          <Trash2 size={24} className="text-red-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Zonă Periculoasă</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <h4 className="font-medium text-red-900 mb-2">Șterge Toate Datele</h4>
            <p className="text-sm text-red-700 mb-3">
              Această acțiune va șterge definitiv toate tranzacțiile, bugetele și setările tale. Acțiunea nu poate fi anulată.
            </p>
            <button 
              onClick={deleteAllData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Șterge Toate Datele
            </button>
          </div>
          
          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <h4 className="font-medium text-red-900 mb-2">Închide Contul</h4>
            <p className="text-sm text-red-700 mb-3">
              Închide permanent contul Clarity. Toate datele vor fi șterse și nu vei mai putea accesa aplicația.
            </p>
            <button 
              onClick={closeAccount}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Închide Contul
            </button>
          </div>
        </div>
      </Card>

      {/* App Version */}
      <Card>
        <div className="text-center text-gray-500">
          <p className="text-sm">Clarity pentru Web</p>
          <p className="text-xs mt-1">Versiunea 2.1.0 • Ultima actualizare: 15 Ianuarie 2025</p>
        </div>
      </Card>
    </div>
  );
};

export default Settings;