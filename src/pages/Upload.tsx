import React, { useState } from 'react';
import { Upload as UploadIcon, FileText, Image, X, Check } from 'lucide-react';
import Card from '../components/Card';

const Upload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: '1',
      name: 'Receipt_Kaufland_2025-01-15.jpg',
      type: 'image',
      size: '2.3 MB',
      status: 'processed',
      amount: -125.50,
      date: '2025-01-15',
      category: 'Mâncare'
    },
    {
      id: '2',
      name: 'Invoice_Netflix_2025-01-14.pdf',
      type: 'pdf',
      size: '156 KB',
      status: 'processing',
      amount: null,
      date: null,
      category: null
    },
    {
      id: '3',
      name: 'Receipt_OMV_2025-01-14.jpg',
      type: 'image',
      size: '1.8 MB',
      status: 'processed',
      amount: -180.00,
      date: '2025-01-14',
      category: 'Transport'
    }
  ]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload logic here
      console.log('Files dropped:', e.dataTransfer.files);
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(files => files.filter(file => file.id !== id));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image size={20} className="text-blue-600" />;
      case 'pdf':
        return <FileText size={20} className="text-red-600" />;
      default:
        return <FileText size={20} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'text-green-600 bg-green-50';
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processed':
        return 'Procesat';
      case 'processing':
        return 'În procesare...';
      case 'error':
        return 'Eroare';
      default:
        return 'În așteptare';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Încărcare Documente</h1>
          <p className="text-gray-600 mt-1">Încarcă bonuri și facturi pentru procesare automată</p>
        </div>
      </div>

      {/* Upload Area */}
      <Card>
        <div
          className={`
            border-2 border-dashed rounded-xl p-12 text-center transition-colors
            ${dragActive 
              ? 'border-indigo-400 bg-indigo-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <UploadIcon size={48} className={`mx-auto mb-4 ${dragActive ? 'text-indigo-600' : 'text-gray-400'}`} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Trage fișierele aici sau apasă pentru a selecta
          </h3>
          <p className="text-gray-600 mb-4">
            Acceptăm imagini (JPG, PNG) și documente PDF
          </p>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
            Selectează Fișiere
          </button>
          <p className="text-sm text-gray-500 mt-3">
            Dimensiune maximă: 10MB per fișier
          </p>
        </div>
      </Card>

      {/* Processing Tips */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Sfaturi pentru cea mai bună procesare</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-medium text-gray-900">Claritate înaltă</p>
              <p className="text-sm text-gray-600">Asigură-te că textul este clar și lizibil</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-medium text-gray-900">Orientare corectă</p>
              <p className="text-sm text-gray-600">Imaginile să fie în poziția corectă</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-medium text-gray-900">Informații complete</p>
              <p className="text-sm text-gray-600">Includ suma totală și data tranzacției</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-medium text-gray-900">Fără obstacole</p>
              <p className="text-sm text-gray-600">Evită umbrele sau reflexii pe document</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Uploaded Files */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Fișiere Încărcate</h2>
        <div className="space-y-3">
          {uploadedFiles.map((file) => (
            <Card key={file.id} hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="mr-4">
                    {getFileIcon(file.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-gray-900">{file.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                        {getStatusText(file.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600">{file.size}</span>
                      {file.status === 'processed' && file.amount && (
                        <>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm font-medium text-gray-900">
                            {file.amount > 0 ? '+' : ''}{file.amount} RON
                          </span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{file.category}</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{file.date}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {file.status === 'processed' && (
                    <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                      <Check size={16} className="text-green-600" />
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Documente Procesate</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">24</p>
            <p className="text-sm text-gray-500 mt-1">luna aceasta</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Precizie Procesare</p>
            <p className="text-2xl font-bold text-green-600 mt-1">96%</p>
            <p className="text-sm text-gray-500 mt-1">rata de succes</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Timp Economisit</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">4.2h</p>
            <p className="text-sm text-gray-500 mt-1">luna aceasta</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Upload;