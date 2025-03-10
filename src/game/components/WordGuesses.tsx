import { LetterStateEnum, WordGuess } from '../../contexes/GameContext';

export const WordGuesses = ({wordGuesses}: {wordGuesses: WordGuess[]}) => {
  const emptyGuesses: WordGuess[] = new Array(6).fill(undefined)
    .map((_, i) => ({
      letters: new Array(5)
        .fill({
          letter: '',
          state: LetterStateEnum.EMPTY
        })
        .map( (lg, j) => wordGuesses[i]?.letters[j] || lg)
    }));
  return (
    <div className="word-guesses">
      {emptyGuesses.map((wg, i) => (
        <div className="word" key={i}>
          {wg.letters.map((lg, i) => (
            <span key={i} className={`letter ` + lg.state}>{lg.letter}</span>
          ))}
        </div>
      ))}
    </div>
  )
}
