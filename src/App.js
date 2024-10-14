// src/App.js
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AlertCircle, Download, CheckCircle } from 'lucide-react';

function App() {
  const [uuid, setUuid] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    let storedUuid = localStorage.getItem('deviceUuid');
    if (!storedUuid) {
      storedUuid = uuidv4();
      localStorage.setItem('deviceUuid', storedUuid);
    }
    setUuid(storedUuid);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    window.addEventListener('appinstalled', () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">QR Code POC</h1>
        
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-300">Your Device UUID:</h2>
          <p className="text-sm md:text-base font-mono bg-gray-600 p-3 rounded border border-gray-500 break-all text-gray-100">{uuid}</p>
        </div>

        {!isAppInstalled && deferredPrompt && (
          <button 
            onClick={handleInstallClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center"
          >
            <Download className="mr-2" size={20} />
            Add to Home Screen
          </button>
        )}

        {!isAppInstalled && !deferredPrompt && (
          <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 text-yellow-100">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
              <h3 className="font-semibold">How to install</h3>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Open this page in your mobile browser</li>
              <li>Tap the share icon or browser menu</li>
              <li>Select 'Add to Home Screen' or 'Install'</li>
            </ol>
          </div>
        )}

        {isAppInstalled && (
          <div className="bg-green-900 border border-green-700 rounded-lg p-4 text-green-100">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              <h3 className="font-semibold">App Installed</h3>
            </div>
            <p className="mt-1 text-sm">
              This app is successfully installed on your device.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;