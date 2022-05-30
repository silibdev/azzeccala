import { useContext } from 'react';
import {
  checkExpiredWord,
  checkWord,
  DEFAULT_GAME_STATE,
  GameContext,
  LetterGuess,
  LetterStateEnum
} from '../contexes/GameContext';
import { LoaderContext } from '../contexes/LoaderContext';

const KEYBOARD = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

export const Keyboard = () => {
  const [gameState, setGameState] = useContext(GameContext);
  // eslint-disable-next-line
  const [_, setLoader] = useContext(LoaderContext);

  const lettersState = gameState.guesses
    .map(wg => wg.letters)
    .flat()
    .reduce<Record<string, LetterStateEnum>>((letterMap, lg) => {
      if (!letterMap[lg.letter]) {
        letterMap[lg.letter] = lg.state;
      }
      return letterMap;
    }, {});

  const keyboard = KEYBOARD
    .map(lettersRow => lettersRow
      .map((letter) => ({
          letter,
          state: lettersState[letter]
        })
      ));

  const indexOfFirstEmpty = gameState.guesses.findIndex(wg => wg.letters.length === 0 || wg.letters[0].state === LetterStateEnum.EMPTY);
  const currentIndex = indexOfFirstEmpty < 0 ? gameState.guesses.length : indexOfFirstEmpty;
  const currentWordGuess = (gameState.guesses[currentIndex] || {letters: []});
  const currentLetters = currentWordGuess.letters;

  const updateGameState = (letters: LetterGuess[], id?: number) => {
    gameState.guesses[currentIndex] = {
      ...currentWordGuess,
      letters
    };
    if (typeof id === 'number') {
      gameState.id = id;
    }
    setGameState({...gameState});
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

  const deleteLastLetter = () => {
    currentLetters.pop();
    updateGameState(currentLetters);
  }

  const confirmWord = async () => {
    if (currentLetters.length < 5) {
      return;
    }
    setLoader(true);
    const [{letters, id}, expired] = await Promise.all([
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
      updateGameState(letters, id);
    }
  }

  return (<div className="keyboard">
    {keyboard.map((lettersRow, i) => (
      <div className="row" key={i}>
        {(i === 2) ? (<button className="action" onClick={deleteLastLetter}>Del</button>) : ''}
        {lettersRow.map(ls => (
          <button
            key={ls.letter}
            className={ls.state}
            onClick={addLetter(ls.letter)}
          >{ls.letter}</button>
        ))}
        {(i === 2) ? (<button className="action" onClick={confirmWord}>Enter</button>) : ''}
      </div>
    ))}
  </div>)
}
