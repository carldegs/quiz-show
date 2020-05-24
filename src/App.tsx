import React from 'react';
import logo from './logo.svg';
import './App.css';
import { DataProvider } from './lib/DataContext';
import MainPage from './MainPage';

function App() {
  return (
    <div className="App">
      <DataProvider>
        <MainPage />
      </DataProvider>
    </div>
  );
}

export default App;
