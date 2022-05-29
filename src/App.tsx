import React, { useState } from 'react';
import './App.css';
import './Loader.css';
import { Header } from './layout/Header';
import { Game } from './game/Game';
import { Footer } from './layout/Footer';
import { LoaderContext } from './contexes/LoaderContext';


function App() {
  const loaderStateArr = useState<boolean>(false);
  const [loader] = loaderStateArr;
  return (
    <div className="App relative">
      <LoaderContext.Provider value={loaderStateArr}>
        {loader && <div className="loader-container"><div className="loader"></div></div>}
        <Header></Header>
        <Game></Game>
        <Footer></Footer>
      </LoaderContext.Provider>
    </div>
  );
}

export default App;
