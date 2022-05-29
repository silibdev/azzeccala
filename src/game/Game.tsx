import { Keyboard } from './Keyboard';
import { WordGuesses } from './WordGuesses';
import { GameContext, GameState, LetterStateEnum } from '../GameContext/GameContext';
import { useState } from 'react';

export const Game = () => {
  const gameStateArr = useState<GameState>({guesses: []});
  const [gameState] = gameStateArr;

  const currentIndex = gameState.guesses.length - 1;
  const currentGuesses = gameState.guesses[currentIndex];
  const lose = currentIndex === 4 && currentGuesses && currentGuesses.letters[0].state !== LetterStateEnum.EMPTY;
  const win = currentGuesses?.letters.every( lg => lg.state === LetterStateEnum.CORRECT);

  return (
    <div>
      <GameContext.Provider value={gameStateArr}>
        <WordGuesses></WordGuesses>
        {!lose && !win && <Keyboard></Keyboard>}
        {lose && !win && <p className="text-center">Hai perso!</p>}
        {win && <p className="text-center">Hai vinto!</p>}
      </GameContext.Provider>
    </div>
  )
}
