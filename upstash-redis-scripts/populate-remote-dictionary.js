const fs = require("fs");
const path = require("path");
const fetch = require("cross-fetch");
require('dotenv').config();

const UPSTASH_REDIS_URL = process.env.UPSTASH_REDIS_URL;
const UPSTASH_REDIS_TOKEN = process.env.UPSTASH_REDIS_TOKEN;
const DICTIONARY_KEY = 'dictionary';
const DICTIONARY_PATH = './dict.txt';

const dictionary = fs.readFileSync(path.resolve(__dirname, DICTIONARY_PATH), 'utf-8').split('\n');

fetch.default(UPSTASH_REDIS_URL + '/pipeline', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${UPSTASH_REDIS_TOKEN}`
  },
  body: JSON.stringify([
    ['DEL', DICTIONARY_KEY],
    ['SADD', DICTIONARY_KEY, ...dictionary]
  ])
})
  .then(res => res.json())
  .then(console.log)
