import { createContext, Dispatch, SetStateAction } from 'react';

export interface GameState {
  guesses: WordGuess[]
}

export interface WordGuess {
  letters: LetterGuess[]
}

export interface LetterGuess {
  letter: string;
  state: LetterStateEnum
}

export enum LetterStateEnum {
  WRONG = 'wrong',
  CORRECT = 'correct',
  NOT_PRESENT = 'not-present',
  EMPTY = 'empty'
}

export const GameContext = createContext<[GameState, Dispatch<SetStateAction<GameState>>]>([
  {guesses: []},
  () => {
  }
])

const currentWord = 'chest'

export const checkWord = (wordGuess: LetterGuess[]): LetterGuess[] =>
  wordGuess.map( (lg, i) => {
    if (currentWord.includes(lg.letter) && currentWord.indexOf(lg.letter) === i) {
      return {
        letter: lg.letter,
        state: LetterStateEnum.CORRECT
      }
    }
    if (currentWord.includes(lg.letter)) {
      return {
        letter: lg.letter,
        state: LetterStateEnum.WRONG
      }
    }
    return {
      letter: lg.letter,
      state: LetterStateEnum.NOT_PRESENT
    }
  })
