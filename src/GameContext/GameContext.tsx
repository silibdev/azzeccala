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

export const checkWord = (wordGuess: LetterGuess[]): Promise<LetterGuess[]> => {
  const body = {word: wordGuess.map(lg => lg.letter).join('')};
  return fetch('./.netlify/functions/word-check', {
    method: 'POST',
    body: JSON.stringify(body)
  })
    .then(resp => resp.json())
    .then(resp => resp.result)
}
