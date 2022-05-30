import { Keyboard } from './Keyboard';
import { WordGuesses } from './WordGuesses';
import {
  checkExpiredWord,
  DEFAULT_GAME_STATE,
  GameContext,
  GameState,
  LetterStateEnum
} from '../contexes/GameContext';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { Win } from './Win';
import { LoaderContext } from '../contexes/LoaderContext';

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
  const gameStateArr = usePersistedState<GameState>(
    'azz-state',
    DEFAULT_GAME_STATE()
  );
  const [gameState, setGameState] = gameStateArr;
  // eslint-disable-next-line
  const [_, setLoader] = useContext(LoaderContext);

  useEffect(() => {
    setLoader(true);
    checkExpiredWord(gameState.id).then(expired => {
      if (expired.isExpired) {
        setGameState({...DEFAULT_GAME_STATE(), id: expired.id})
      }
    }).finally(() => setLoader(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentIndex = gameState.guesses.length - 1;
  const currentGuesses = gameState.guesses[currentIndex];
  const lose = currentIndex === 5 && currentGuesses && currentGuesses.letters[0].state !== LetterStateEnum.EMPTY;
  const win = currentGuesses && !!currentGuesses.letters.length && currentGuesses.letters.every(lg => lg.state === LetterStateEnum.CORRECT);

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
