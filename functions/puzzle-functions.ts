
// This file is a bridge to import the AI flows from the src directory
// so they can be compiled and used by the main Firebase Functions index.js.

import { generateNewPuzzle } from '../src/ai/flows/generate-puzzle';
import { requestPuzzleHint } from '../src/ai/flows/generate-hint';

// This is necessary because Genkit's defineFlow registers the flow globally.
// By importing them here, they become available to the Genkit ecosystem
// when the function is initialized.
import '../src/ai/genkit'; 

// We export the functions to be used in index.js
module.exports = {
  generateNewPuzzle,
  requestPuzzleHint,
};
