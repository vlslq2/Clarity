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
  Sun
} from 'lucide-react';
import Card from '../components/Card';

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState('RON');
  const [language, setLanguage] = useState('ro');

  const settingsSections = [
    {
      title: 'Aspect și Limba',
      icon: Palette,
      settings: [
        {
          label: 'Mod Întunecat',
          description: 'Comută între temele luminoasă și întunecată',
          type: 'toggle',
          value: darkMode,
          onChange: setDarkMode
        },
        {
          label: 'Limbă',
          description: 'Schimbă limba aplicației',
          type: 'select',
          value: language,
          onChange: setLanguage,
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
          value: currency,
          onChange: setCurrency,
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
          value: 'dd/mm/yyyy',
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
          value: true
        },
        {
          label: 'Alertă Depășire Buget',
          description: 'Primește notificări când bugetul este depășit',
          type: 'toggle',
          value: true
        },
        {
          label: 'Categorizare Automată',
          description: 'Categorizează automat tranzacțiile similare',
          type: 'toggle',
          value: true
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
          value: false
        },
        {
          label: 'Sincronizare Date',
          description: 'Sincronizează datele între dispozitive',
          type: 'toggle',
          value: true
        },
        {
          label: 'Analitice Anonime',
          description: 'Ajută la îmbunătățirea aplicației prin date anonime',
          type: 'toggle',
          value: true
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
              checked={setting.value}
              onChange={(e) => setting.onChange?.(e.target.checked)}
            />
            <div 
              className={`w-10 h-6 rounded-full shadow-inner cursor-pointer transition-colors ${
                setting.value ? 'bg-indigo-500' : 'bg-gray-300'
              }`}
              onClick={() => setting.onChange?.(!setting.value)}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ease-in-out transform mt-1 ${
                setting.value ? 'translate-x-5' : 'translate-x-1'
              }`}></div>
            </div>
          </div>
        );
      case 'select':
        return (
          <select
            value={setting.value}
            onChange={(e) => setting.onChange?.(e.target.value)}
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
          <button className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors">
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
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
              Șterge Toate Datele
            </button>
          </div>
          
          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <h4 className="font-medium text-red-900 mb-2">Închide Contul</h4>
            <p className="text-sm text-red-700 mb-3">
              Închide permanent contul Clarity. Toate datele vor fi șterse și nu vei mai putea accesa aplicația.
            </p>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
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