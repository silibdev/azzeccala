import {
  LetterStateEnum
} from '../../contexes/GameContext';

const KEYBOARD = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

export interface KeyboardProps {
  usedLetters: Record<string, LetterStateEnum>;
  buttonClicked: (button: string | 'Enter' | 'Delete') => void;
}

export const Keyboard = ({usedLetters, buttonClicked}: KeyboardProps) => {

  const keyboard = KEYBOARD
    .map(lettersRow => lettersRow
      .map((letter) => ({
          letter,
          state: usedLetters[letter]
        })
      ));

  const buttonClick = (button: string | 'Enter' | 'Delete') => () => buttonClicked(button);
  return (<div className="keyboard">
    {keyboard.map((lettersRow, i) => (
      <div className="row" key={i}>
        {i === 2 && (<button className="action" onClick={buttonClick('Enter')}>Enter</button>)}
        {lettersRow.map(ls => (
          <button
            key={ls.letter}
            className={ls.state}
            onClick={buttonClick(ls.letter)}
          >{ls.letter}</button>
        ))}
        {i === 2 && (<button className="action" onClick={buttonClick('Delete')}>Del</button>)}
      </div>
    ))}
  </div>)
}
