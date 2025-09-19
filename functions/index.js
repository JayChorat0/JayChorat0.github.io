
const { onCall } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { genkit, googleAI } = require("genkit/plugins");
const {
  generateNewPuzzle,
} = require("../../src/ai/flows/generate-puzzle.ts");
const {
  requestPuzzleHint,
} = require("../../src/ai/flows/generate-hint.ts");

initializeApp();

genkit({
  plugins: [googleAI()],
  model: "googleai/gemini-1.5-flash-latest",
});

exports.generateNewPuzzle = onCall(async (request) => {
  const puzzle = await generateNewPuzzle(request.data);
  return puzzle;
});

exports.requestPuzzleHint = onCall(async (request) => {
  const hint = await requestPuzzleHint(request.data);
  return hint;
});
