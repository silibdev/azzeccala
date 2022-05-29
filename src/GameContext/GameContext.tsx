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
