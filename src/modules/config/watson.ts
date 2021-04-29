import NaturalLanguageUnderstandingV1 from 'watson-developer-cloud/natural-language-understanding/v1.js';

console.log('teste watson');

export const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey: process.env.WATSON_API_KEY,
  version: '2018-04-05',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/',
});
