import { Keyboard } from './Keyboard';
import { WordGuesses } from './WordGuesses';
import { GameContext, GameState, LetterStateEnum } from '../GameContext/GameContext';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Win } from './Win';

function usePersistedState<S>(key: string, defaultValue: S): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState<S>(
    () => JSON.parse(localStorage.getItem(key) || 'null') || defaultValue
  );
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

export const Game = () => {
  const gameStateArr = usePersistedState<GameState>('azz-state', {guesses: []});
  const [gameState] = gameStateArr;

  const currentIndex = gameState.guesses.length - 1;
  const currentGuesses = gameState.guesses[currentIndex];
  const lose = currentIndex === 5 && currentGuesses && currentGuesses.letters[0].state !== LetterStateEnum.EMPTY;
  const win = currentGuesses && !!currentGuesses.letters.length && currentGuesses.letters.every( lg => lg.state === LetterStateEnum.CORRECT);

  return (
    <div>
      <GameContext.Provider value={gameStateArr}>
        <WordGuesses></WordGuesses>
        {!lose && !win && <Keyboard></Keyboard>}
        {lose && !win && <p className="text-center text-2xl font-bold">Sei una pippa!</p>}
        {win && <Win gameState={gameState}></Win>}
      </GameContext.Provider>
    </div>
  )
}
