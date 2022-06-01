import { createContext, Dispatch, SetStateAction } from 'react';

export interface GameState {
  guesses: WordGuess[],
  id?: number,
  word?: string
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

export const DEFAULT_GAME_STATE = () => ({guesses: []});

export const GameContext = createContext<[GameState, Dispatch<SetStateAction<GameState>>]>([
  DEFAULT_GAME_STATE(),
  () => {
  }
])

export const checkWord = (wordGuess: LetterGuess[]): Promise<{ letters: LetterGuess[], id: number, word: string }> => {
  const body = {word: wordGuess.map(lg => lg.letter).join('')};
  return fetch('./.netlify/functions/word-check', {
    method: 'POST',
    body: JSON.stringify(body)
  })
    .then(resp => resp.json())
    .then(resp => resp.result)
}

export const checkExpiredWord = async (id?: number): Promise<{ isExpired: boolean, id: number, word: string }>  => {
  return fetch('./.netlify/functions/word-expired?id=' + id)
    .then(resp => resp.json())
    .then(resp => resp.result);
}
