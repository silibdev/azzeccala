import { GameState, LetterStateEnum } from '../GameContext/GameContext';
import { useState } from 'react';

export const Win = ({gameState}: { gameState: GameState }) => {
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
      }).join(' ')
    ).join('\n');
  const textToShare = `Azzeccata in ${gameState.guesses.length}/6\n\n${textGameState}`;

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
      <p className="text-2xl font-bold">Daje!</p>
      <button className="btn text-xl" onClick={share}>Condividi</button>
      {copiedText && <p>{copiedText}</p>}
    </div>
  )
}
