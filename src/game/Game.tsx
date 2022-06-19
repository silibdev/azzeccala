import { Keyboard } from './components/Keyboard';
import { WordGuesses } from './components/WordGuesses';
import {
  checkExpiredWord, checkWord,
  DEFAULT_GAME_STATE,
  GameContext,
  GameState, LetterGuess,
  LetterStateEnum, WordGuess
} from '../contexes/GameContext';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { GameOver } from './components/GameOver';
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
  const currentWordGuess: WordGuess | undefined = gameState.guesses[currentIndex];
  const currentLetters = currentWordGuess.letters;

  const lose = currentIndex === 5 && currentWordGuess?.letters[0]?.state !== LetterStateEnum.EMPTY;
  const win = currentWordGuess?.letters.every(lg => lg.state === LetterStateEnum.CORRECT);
  const finish = win || lose;

  const usedLetters: Record<string, LetterStateEnum> = gameState.guesses
    .map(wg => wg.letters)
    .flat()
    .reduce<Record<string, LetterStateEnum>>((letterMap, lg) => {
      if (!letterMap[lg.letter] || lg.state === LetterStateEnum.CORRECT) {
        letterMap[lg.letter] = lg.state;
      }
      return letterMap;
    }, {});

  const updateGameState = (letters: LetterGuess[], id?: number, word?: string) => {
    gameState.guesses[currentIndex] = {
      ...currentWordGuess,
      letters
    };
    if (typeof id === 'number') {
      gameState.id = id;
    }
    if (typeof word === 'string') {
      gameState.word = word;
    }
    setGameState({...gameState});
  }

  const confirmWord = async () => {
    if (currentLetters.length < 5) {
      return;
    }
    setLoader(true);
    const [{letters, id, word}, expired] = await Promise.all([
      checkWord(currentLetters),
      checkExpiredWord(gameState.id)
    ])
    setLoader(false);
    if (expired.isExpired || gameState.id !== id) {
      setGameState({
        ...DEFAULT_GAME_STATE(),
        id: expired.id
      })
    } else {
      updateGameState(letters, id, word);
    }
  }

  const deleteLastLetter = () => {
    currentLetters.pop();
    updateGameState(currentLetters);
  }

  const addLetter = (letter: string) => () => {
    if (currentLetters.length >= 5) {
      return;
    }

    updateGameState(currentLetters.concat({
      letter,
      state: LetterStateEnum.EMPTY
    }))
  }

  const buttonClicked = async (button: string | 'Enter' | 'Delete') => {
    switch (button) {
      case 'Enter':
        await confirmWord();
        break;
      case 'Delete':
        deleteLastLetter()
        break;
      default:
        addLetter(button);
    }
  }

  return (
    <div>
      <GameContext.Provider value={gameStateArr}>
        <WordGuesses wordGuesses={gameState.guesses}></WordGuesses>
        {!finish
          ? <Keyboard usedLetters={usedLetters} buttonClicked={buttonClicked}></Keyboard>
          : <GameOver gameState={gameState} win={win}></GameOver>}
      </GameContext.Provider>
    </div>
  )
}
