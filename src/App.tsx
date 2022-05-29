import React from 'react';
import './App.css';
import { Header } from './layout/Header';
import { Game } from './game/Game';
import { Footer } from './layout/Footer';


function App() {
  return (
    <div className="App">
      <Header></Header>
      <Game></Game>
      <Footer></Footer>
    </div>
  );
}

export default App;
