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

  const wordOfTheDay = (await getWordOfTheDay());
  const currentWord = wordOfTheDay.word;
  const letters = checkWord(currentWord || '', body.word.split(''));

  return {
    statusCode: 200,
    body: JSON.stringify({result: {letters, id: wordOfTheDay.id, word: wordOfTheDay.word}})
  };
};

const checkWord = (currentWord: string, letters: string[]): LetterGuess[] => {
  return letters.map((letter, i) => {
    if (currentWord.includes(letter) && currentWord[i] === letter) {
      currentWord = currentWord.replace(letter, '*');
      return {
        letter,
        state: LetterStateEnum.CORRECT
      };
    }
    return {
      letter,
      state: LetterStateEnum.NOT_PRESENT
    }
  }).map((letterState) => {
    if (currentWord.includes(letterState.letter)) {
      currentWord = currentWord.replace(letterState.letter, '*');
      return {
        letter: letterState.letter,
        state: LetterStateEnum.WRONG
      }
    }
    return letterState;
  })
}

export { handler };
