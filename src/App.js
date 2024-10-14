import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [uuid, setUuid] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  useEffect(() => {
    let storedUuid = localStorage.getItem('deviceUuid');
    if (!storedUuid) {
      storedUuid = getCookie('deviceUuid');
    }
    if (!storedUuid) {
      storedUuid = uuidv4();
      localStorage.setItem('deviceUuid', storedUuid);
      setCookie('deviceUuid', storedUuid, 365);
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
    <div className="App">
      <header className="App-header">
        <h1>QR Code POC</h1>
        <p>Your device UUID: {uuid}</p>
        {!isAppInstalled && deferredPrompt && (
          <button onClick={handleInstallClick}>Add to Home Screen</button>
        )}
        {!isAppInstalled && !deferredPrompt && (
          <p>
            To add this app to your home screen:
            <br />
            1. Open this page in your mobile browser
            <br />
            2. Tap the share icon or browser menu
            <br />
            3. Select 'Add to Home Screen' or 'Install'
          </p>
        )}
      </header>
    </div>
  );
}

export default App;
