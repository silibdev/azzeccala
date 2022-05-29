import { useContext } from 'react';
import { checkWord, GameContext, LetterGuess, LetterStateEnum } from '../GameContext/GameContext';

const KEYBOARD = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

export const Keyboard = () => {
  const [gameState, setGameState] = useContext(GameContext);

  const lettersState = gameState.guesses
    .map(wg => wg.letters)
    .flat()
    .reduce<Record<string, LetterStateEnum>>((letterMap, lg) => {
      letterMap[lg.letter] = lg.state;
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

  const updateGameState = (letters: LetterGuess[]) => {
    gameState.guesses[currentIndex] = {
      ...currentWordGuess,
      letters
    };
    setGameState({...gameState});
  }

  const addLetter = (letter: string) => () => {
    if (currentLetters.length >= 5) {
      return;
    }
    currentLetters.push({
      letter,
      state: LetterStateEnum.EMPTY
    });
    updateGameState(currentLetters)
  }

  const deleteLastLetter = () => {
    currentLetters.pop();
    updateGameState(currentLetters);
  }

  const confirmWord = () => {
    if (currentLetters.length < 5) {
      return;
    }
    const checkedLetters = checkWord(currentLetters);
    updateGameState(checkedLetters);
  }

  return (<div className="keyboard">
    {keyboard.map((lettersRow, i) => (
      <div className="row" key={i}>
        {(i === 2) ? (<button className="action" onClick={deleteLastLetter}>Del</button>) : ''}
        {lettersRow.map(ls => (
          <button
            key={ls.letter}
            className={ls.state}
            disabled={ls.state === LetterStateEnum.NOT_PRESENT}
            onClick={addLetter(ls.letter)}
          >{ls.letter}</button>
        ))}
        {(i === 2) ? (<button className="action" onClick={confirmWord}>Enter</button>) : ''}
      </div>
    ))}
  </div>)
}
