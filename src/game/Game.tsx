import { Keyboard } from './Keyboard';
import { WordGuesses } from './WordGuesses';
import { GameContext, GameState } from '../GameContext/GameContext';
import { useState } from 'react';

export const Game = () => {
  const gameState = useState<GameState>({guesses: []})

  return (
    <div>
      <GameContext.Provider value={gameState}>
        <WordGuesses></WordGuesses>
        <Keyboard></Keyboard>
      </GameContext.Provider>
    </div>
  )
}
