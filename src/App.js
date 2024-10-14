import React from 'react';
import useUuid from './useUuid';

const App = () => {
  const apiUrl = 'http://www.randomnumberapi.com/api/v1.0/random?min=100&max=1000&count=1'; 
  const uuid = useUuid(apiUrl); 

  return (
    <div className="App">
      <header className="App-header">
        <h1>UUID Example App</h1>
        <p>Your device UUID: {uuid}</p>
      </header>
    </div>
  );
};

export default App;
