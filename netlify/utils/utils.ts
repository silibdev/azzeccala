require('dotenv').config();

const UPSTASH_REDIS_URL = process.env.UPSTASH_REDIS_URL as string;
const UPSTASH_REDIS_TOKEN = process.env.UPSTASH_REDIS_TOKEN;
const WOTD_KEY = (process.env.NETLIFY ? 'test-' : '') + 'word-of-the-day';
const WORD_EXPIRATION = process.env.WORD_EXP || 'h:2';
const DICTIONARY_KEY = 'dictionary';
const USED_WORDS_KEY = (process.env.NETLIFY ? 'test-' : '') + 'used-words';

export interface WordOfTheDay {
  word: string;
  timestamp: string;
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

const execRedisCommand = (command: string, ...args: string[]) => fetch(UPSTASH_REDIS_URL, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${UPSTASH_REDIS_TOKEN}`
  },
  body: JSON.stringify([command, ...args])
})
  .then(res => res.json())
  .then(json => json.result)

export const getWordOfTheDay = async (): Promise<WordOfTheDay | null> => {
  const wotdData = await execRedisCommand('GET', WOTD_KEY);
  return JSON.parse(wotdData) as WordOfTheDay;
}

export const updateWordOfTheDay = async () =>
  execRedisCommand(
    'SET', WOTD_KEY, JSON.stringify({
      word: await selectNewWord(),
      timestamp: new Date().toISOString()
    })
  )

export const getDictionary = async (): Promise<string[]> => execRedisCommand('SMEMBERS', DICTIONARY_KEY);

export const getUsedWords = async (): Promise<Set<string>> =>
  execRedisCommand('SMEMBERS', USED_WORDS_KEY).then(usedWords => new Set(usedWords));

export const addUsedWord = async (newWord: string) => execRedisCommand('SADD', USED_WORDS_KEY, newWord);

export const clearUsedWord = async () => execRedisCommand('DEL', USED_WORDS_KEY)

const getAbsoluteDate = (date: Date) => {
  return new Date(date.toDateString()).valueOf();
}

const isDatePassed = (refDate: Date, checkDate: Date): boolean => {
  const [mode, value] = WORD_EXPIRATION.split(':');
  switch (mode) {
    case 'h':
      return refDate.valueOf() - checkDate.valueOf() > 1000 * 60 * 60 * +value;
    case 'd':
      return getAbsoluteDate(refDate) - getAbsoluteDate(checkDate) > 1000 * 60 * 60 * 24 * +value;
  }
  return false;
}

export const isWordStillValid = async () => {
  const wordOfTheDay = await getWordOfTheDay();
  if (!wordOfTheDay) {
    return false;
  }
  const wordTime = new Date(wordOfTheDay.timestamp);
  const now = new Date();
  return isDatePassed(now, wordTime);
}

export const selectNewWord = async (): Promise<string> => {
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

  return newWord;
}
