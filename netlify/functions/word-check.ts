import { Handler } from "@netlify/functions";
import { getWordOfTheDay, LetterGuess, LetterStateEnum } from '../utils/utils';


const handler: Handler = async (event, _) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {statusCode: 405, body: "Method Not Allowed"};
  }

  const body: { word: string } = JSON.parse(event.body || 'undefined');
  if (!body.word) {
    return {statusCode: 400, body: "Bad Request"}
  }

  const currentWord = (await getWordOfTheDay())?.word;
  const result = checkWord(currentWord || '', body.word.split(''));

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
