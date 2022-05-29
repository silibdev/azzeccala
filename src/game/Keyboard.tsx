import { useContext } from 'react';
import { GameContext, LetterStateEnum } from '../GameContext/GameContext';

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
  return (<div className="keyboard">
    {keyboard.map( (lettersRow, i) => (
      <div className="row" key={i}>
        {(i === 2) ? (<button className="action">Del</button>) : ''}
        {lettersRow.map( ls => (
          <button
            key={ls.letter}
            className={ls.state}
            disabled={ls.state === LetterStateEnum.NOT_PRESENT}
          >{ls.letter}</button>
        ))}
        {(i === 2) ? (<button className="action">Enter</button>) : ''}
      </div>
    ))}
  </div>)
}
