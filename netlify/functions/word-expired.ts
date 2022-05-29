import { Handler } from '@netlify/functions';
import * as fs from 'fs';

const WORD_OF_THE_DAY_PATH = 'netlify/functions/word-of-the-day.json';
const DICT_PATH = 'netlify/functions/dict.txt';
const USED_WORDS = 'netlify/functions/used-words.txt';


const getAbsoluteDate = (date: Date) => {
  return new Date(date.toDateString());
}

const isWordPassed = (currentWordTime: string, requestedWordTime: string): boolean =>
  new Date(currentWordTime).valueOf() - new Date(requestedWordTime).valueOf() > 1000 * 60 * 60 * 2 // 2 hours
// getAbsoluteDate(new Date(currentWordTime)) < getAbsoluteDate(new Date())

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
  // Only allow GET
  if (event.httpMethod !== "GET") {
    return {statusCode: 405, body: "Method Not Allowed"};
  }

  const requestedTimestamp = event.queryStringParameters.timestamp;
  if (!requestedTimestamp) {
    return {statusCode: 400, body: "Bad Request"}
  }

  let wordOfTheDay: { word: string, timestamp: string } | undefined;
  try{
    const wordOfTheDayData = await fs.promises.readFile(WORD_OF_THE_DAY_PATH, 'utf-8');
    wordOfTheDay = JSON.parse(wordOfTheDayData);
  } catch (e) {}

  const isPassed = !!wordOfTheDay && isWordPassed(wordOfTheDay.timestamp, requestedTimestamp);

  if (!wordOfTheDay || isWordPassed(wordOfTheDay.timestamp, new Date().toISOString())) {
    // Create new word of the day
    wordOfTheDay = {
      word: await getNewWord(),
      timestamp: new Date().toISOString()
    };
    // Save it
    await fs.promises.writeFile(WORD_OF_THE_DAY_PATH, JSON.stringify(wordOfTheDay, null, 2))
  }

  return {
    statusCode: 200,
    body: JSON.stringify({result: isPassed})
  };
};

export { handler };
