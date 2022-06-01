import { GameState, LetterStateEnum } from '../contexes/GameContext';
import { useState } from 'react';

export const GameOver = ({gameState, win, lose}: { gameState: GameState, win: boolean, lose: boolean }) => {
  const [copiedText, setCopiedText] = useState('');
  const textGameState = gameState.guesses
    .map(wg => wg.letters
      .map(lg => {
        switch (lg.state) {
          case LetterStateEnum.CORRECT:
            return '🟩';
          case LetterStateEnum.WRONG:
            return '🟨';
          case LetterStateEnum.NOT_PRESENT:
            return '⬜️'
          default:
            return '🟫';
        }
      }).join('')
    ).join('\n');
  let textToShare = `#${gameState.id} `;
  if (win) {
    textToShare += `Azzeccata in ${gameState.guesses.length}/6`;
  }
  if (lose) {
    textToShare += `Sono un pippa!\nNon l'ho azzeccata`;
  }
  textToShare += '\n' + textGameState;

  const share = () => {
    if (navigator.share) {
      navigator.share({text: textToShare}).then(() =>
        sharedCorrectly('Risultato condiviso')
      )
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(textToShare).then(() =>
        sharedCorrectly('Risultato copiato')
      );
    }
  }

  const sharedCorrectly = (text: string) => {
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000)
  }
  return (
    <div className="text-center">
      <p className="text-2xl font-bold">{win && 'Daje!'}{lose && 'Sei una pippa!'}</p>
      {lose && <div className="pb-3 text-xl">La parola era "<span className="uppercase">{gameState.word}</span>"</div>}
      <button className="btn text-xl" onClick={share}>Condividi</button>
      {copiedText && <p>{copiedText}</p>}
    </div>
  )
}
