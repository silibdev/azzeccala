import { getStore, GetStoreOptions } from '@netlify/blobs';

const fetch = require('cross-fetch').default;


const SITE_ID = process.env.SITE_ID;
const TOKEN = process.env.TOKEN;
const IS_PROD = !!process.env.PROD;
const WOTD_KEY = (IS_PROD ? '' : 'test-') + 'word-of-the-day';
const WORD_EXPIRATION = process.env.WORD_EXP || 'h:2';
const DICTIONARY_KEY = 'dictionary';
const USED_WORDS_KEY = (IS_PROD ? '' : 'test-') + 'used-words';

export interface WordOfTheDay {
  word: string;
  timestamp: string;
  id: number;
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

console.log({SITE_ID});
const getBlobsStore = () => {
  const storeOptions: GetStoreOptions = {
    name: 'azzeccala-store',
    siteID: SITE_ID,
    token: TOKEN,
    fetch
  };
  return getStore(storeOptions);
}

export const getWordOfTheDay = async (): Promise<WordOfTheDay> => {
  const wotdData = await getBlobsStore().get(WOTD_KEY, {type: 'json'})
  if (wotdData) {
    return wotdData as WordOfTheDay;
  }
  return updateWordOfTheDay();
}

export const updateWordOfTheDay = async () => {
  const {word, id} = await selectNewWord();
  const newWordOfTheDay: WordOfTheDay = {
    word,
    id,
    timestamp: new Date().toISOString()
  };
  await getBlobsStore().setJSON(WOTD_KEY, newWordOfTheDay)
  return newWordOfTheDay;
}

export const getDictionary = async (): Promise<string[]> => getBlobsStore().get(DICTIONARY_KEY, {type: 'json'});

export const getUsedWords = async (): Promise<Set<string>> =>
  getBlobsStore().get(USED_WORDS_KEY, {type: 'json'}).then((usedWords: string[]) => new Set(usedWords));

export const addUsedWord = async (newWord: string) => {
  const usedWords = await getUsedWords();
  usedWords.add(newWord);  
  await getBlobsStore().setJSON(USED_WORDS_KEY, Array.from(usedWords));
};

export const clearUsedWord = async () => getBlobsStore().delete(USED_WORDS_KEY);

const getAbsoluteDate = (date: Date) => {
  return new Date(date.toDateString()).valueOf();
}

const isDatePassed = (refDate: Date, checkDate: Date): boolean => {
  const [mode, value] = WORD_EXPIRATION.split(':');
  switch (mode) {
    case 'h':
      return refDate.valueOf() - checkDate.valueOf() >= 1000 * 60 * 60 * +value;
    case 'd':
      return getAbsoluteDate(refDate) - getAbsoluteDate(checkDate) >= 1000 * 60 * 60 * 24 * +value;
  }
  return false;
}

export const isWordValid = async (id: number): Promise<[boolean, number]> => {
  let wordOfTheDay = await getWordOfTheDay();

  // Check if word timer has expired
  const wordTime = new Date(wordOfTheDay.timestamp);
  const now = new Date();
  const isWordStillValid = !isDatePassed(now, wordTime);
  if (!isWordStillValid) {
    wordOfTheDay = await updateWordOfTheDay();
  }

  const wordValidForClient = wordOfTheDay.id === id;

  return [isWordStillValid && wordValidForClient, wordOfTheDay.id];
}

export const selectNewWord = async (): Promise<{ word: string, id: number }> => {
  const dict = await getDictionary();
  const usedWords = await getUsedWords();

  // Array with only unused word
  let unusedWords = dict.filter(word => !usedWords.has(word));
  // If empty
  if (!unusedWords.length) {
    // Reset used words
    await clearUsedWord();
    // Any word in the dict can be chosen
    unusedWords = dict;
  }

  // Chose random word
  let newWord: string;
  do {
    newWord = unusedWords[~~(Math.random() * dict.length)];
  } while (!newWord);
  // Add it to used ones
  await addUsedWord(newWord);

  return {
    word: newWord,
    id: dict.length - unusedWords.length
  };
}
