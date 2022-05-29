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

const WORD_OF_THE_DAY_PATH = './word-of-the-day.json';

const getAbsoluteDate = (date: Date) => {
  return new Date(date.toDateString());
}

const getCurrentWord = () => {
  const wordOfTheDay: {word: string, timestamp: string} = require(WORD_OF_THE_DAY_PATH);
  if (getAbsoluteDate(new Date(wordOfTheDay.timestamp)) < getAbsoluteDate(new Date())) {
    fs.writeFileSync(WORD_OF_THE_DAY_PATH, JSON.stringify({
      word: 'word',
      timestamp: new Date().toISOString()
    }))
  }
  return wordOfTheDay.word;
}

const handler: Handler = async (event, _) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const body: { word: string} = JSON.parse(event.body);
  if (!body.word) {
    return { statusCode: 400, body: "Bad Request"}
  }

  const currentWord = getCurrentWord();
  const result = checkWord(currentWord, body.word.split(''));

  return {
    statusCode: 200,
    body: JSON.stringify({result}),
  };
};

const checkWord = (currentWord: string, letters: string[]): LetterGuess[] =>
  letters.map( (letter, i) => {
    if (currentWord.includes(letter) && currentWord.indexOf(letter) === i) {
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
