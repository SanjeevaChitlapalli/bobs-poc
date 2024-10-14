import { useState, useEffect } from 'react';

const setCookie = (name, value) => {
  document.cookie = `${name}=${value}; path=/`; // No expiration date
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const useUuid = (apiUrl) => {
  const [uuid, setUuid] = useState('');

  useEffect(() => {
    const getOrCreateUuid = () => {
      let storedUuid = localStorage.getItem('deviceUuid') || getCookie('deviceUuid');

      if (!storedUuid) {
        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            storedUuid = data[0];
            localStorage.setItem('deviceUuid', storedUuid);
            setCookie('deviceUuid', storedUuid); 
            setUuid(storedUuid); 
          })
          .catch((error) => {
            console.error('Error fetching UUID from API:', error);
          });
      } else {
        setUuid(storedUuid); 
      }
    };

    getOrCreateUuid();
  }, [apiUrl]);

  return uuid;
};

export default useUuid;
