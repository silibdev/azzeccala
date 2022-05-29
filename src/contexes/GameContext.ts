import { createContext, Dispatch, SetStateAction } from 'react';

export interface GameState {
  guesses: WordGuess[],
  timestamp: string
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

export const DEFAULT_GAME_STATE = {guesses: [], timestamp: new Date().toISOString()};

export const GameContext = createContext<[GameState, Dispatch<SetStateAction<GameState>>]>([
  DEFAULT_GAME_STATE,
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

export const checkExpiredWord = async (timestamp: string): Promise<boolean>  => {
  return fetch('./.netlify/functions/word-expired?timestamp=' + timestamp)
    .then(resp => resp.json())
    .then(resp => resp.result);
}
