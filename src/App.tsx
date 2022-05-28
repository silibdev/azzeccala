import React from 'react';
import './App.css';
import { Header } from './layout/header';
import { Game } from './game/Game';


function App() {
  return (
    <div className="App">
      <Header></Header>
      <Game></Game>
    </div>
  );
}

export default App;
