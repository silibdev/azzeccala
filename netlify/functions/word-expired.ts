import { Handler } from '@netlify/functions';
import { isWordValid } from '../utils/utils';

const handler: Handler = async (event, _) => {
  // Only allow GET
  if (event.httpMethod !== "GET") {
    return {statusCode: 405, body: "Method Not Allowed"};
  }

  const id = event.queryStringParameters?.id;
  if (!id) {
    return {statusCode: 400, body: "Bad Request"}
  }

  const [isValid, idCurrentWord] = await isWordValid(+id);

  return {
    statusCode: 200,
    body: JSON.stringify({result: {isExpired: !isValid, id: idCurrentWord}})
  };
};

export { handler };
