const fs = require("fs");
const path = require("path");
const fetch = require("cross-fetch");
const {getStore} = require("@netlify/blobs");
require('dotenv').config();

const SITE_ID = process.env.SITE_ID;
const TOKEN = process.env.TOKEN;
const DICTIONARY_KEY = 'dictionary';
const DICTIONARY_PATH = './dict.txt';
const USED_WORDS_KEY = (true ? '' : 'test-') + 'used-words';

const dictionary = fs.readFileSync(path.resolve(__dirname, DICTIONARY_PATH), 'utf-8').split('\n');

const blobStore = getStore({fetch, name: 'azzeccala-store', siteID: SITE_ID, token: TOKEN});

await blobStore.setJSON(DICTIONARY_KEY, dictionary).then(console.log);

// Potrebbe non essere subito aggiornato
await blobStore.get(DICTIONARY_KEY, {type: 'json'}).then(console.log);

// await blobStore.delete(USED_WORDS_KEY).then(console.log);

