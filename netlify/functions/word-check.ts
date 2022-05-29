import { Handler } from "@netlify/functions";
import * as fs from 'fs';

interface LetterGuess {
  letter: string;
  state: LetterStateEnum
}

enum LetterStateEnum {
  WRONG = 'wrong',
  CORRECT = 'correct',
  NOT_PRESENT = 'not-present',
  EMPTY = 'empty'
}

const WORD_OF_THE_DAY_PATH = 'netlify/functions/word-of-the-day.json';
const DICT_PATH = 'netlify/functions/dict.txt';
const USED_WORDS = 'netlify/functions/used-words.txt';

const getAbsoluteDate = (date: Date) => {
  return new Date(date.toDateString());
}

const isWordPassed = (currentWordTime: string): boolean =>
  new Date().valueOf() - new Date(currentWordTime).valueOf() > 1000 * 60 * 60 * 2 // 2 hours
// getAbsoluteDate(new Date(currentWordTime)) < getAbsoluteDate(new Date())

const getCurrentWord = async () => {
  let wordOfTheDay: { word: string, timestamp: string } | undefined;
  try {
    // Get saved word of the day
    const data = await fs.promises.readFile(WORD_OF_THE_DAY_PATH, 'utf-8');
    wordOfTheDay = JSON.parse(data);
  } catch (e) {
  }
  // If not present or older than today
  if (!wordOfTheDay || isWordPassed(wordOfTheDay.timestamp)) {
    // Create new word of the day
    wordOfTheDay = {
      word: await getNewWord(),
      timestamp: new Date().toISOString()
    };
    // Save it
    await fs.promises.writeFile(WORD_OF_THE_DAY_PATH, JSON.stringify(wordOfTheDay, null, 2))
  }
  console.log('newWord', wordOfTheDay.word);
  return wordOfTheDay.word;
}

const getNewWord = async (): Promise<string> => {
  const dict = (await fs.promises.readFile(DICT_PATH, 'utf-8')).split('\n');
  let usedWords = [];
  try {
    usedWords = (await fs.promises.readFile(USED_WORDS, 'utf-8')).split('\n');
  } catch (e) {
  }

  // Array with only unused word
  let unusedWords = dict.filter(word => !usedWords.includes(word));
  // If empty
  if (!unusedWords.length) {
    // Reset used words
    await fs.promises.writeFile(USED_WORDS, '');
    // Any word in the dict can be chosen
    unusedWords = dict;
  }

  // Chose random word
  const newWord = unusedWords[~~(Math.random() * dict.length)];
  // Add it to used ones
  await fs.promises.appendFile(USED_WORDS, newWord + '\n');

  return newWord;
}

const handler: Handler = async (event, _) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {statusCode: 405, body: "Method Not Allowed"};
  }

  const body: { word: string } = JSON.parse(event.body);
  if (!body.word) {
    return {statusCode: 400, body: "Bad Request"}
  }

  const currentWord = await getCurrentWord();
  const result = checkWord(currentWord, body.word.split(''));

  return {
    statusCode: 200,
    body: JSON.stringify({result})
  };
};

const checkWord = (currentWord: string, letters: string[]): LetterGuess[] =>
  letters.map((letter, i) => {
    if (currentWord.includes(letter) && currentWord[i] === letter) {
      return {
        letter,
        state: LetterStateEnum.CORRECT
      }
    }
    if (currentWord.includes(letter)) {
      return {
        letter,
        state: LetterStateEnum.WRONG
      }
    }
    return {
      letter,
      state: LetterStateEnum.NOT_PRESENT
    }
  })

export { handler };
