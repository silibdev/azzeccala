import { Handler } from '@netlify/functions';
import { isWordStillValid, updateWordOfTheDay } from '../utils/utils';

const handler: Handler = async (event, _) => {
  // Only allow GET
  if (event.httpMethod !== "GET") {
    return {statusCode: 405, body: "Method Not Allowed"};
  }

  const isWordValid = await isWordStillValid();

  if (!isWordValid) {
    await updateWordOfTheDay();
  }

  return {
    statusCode: 200,
    body: JSON.stringify({result: isWordValid})
  };
};

export { handler };
