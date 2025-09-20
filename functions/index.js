
const { onCall } = require("firebase-functions/v2/on_call");
const { initializeApp } = require("firebase-admin/app");
const { genkit } = require("genkit");
const { googleAI } = require("@genkit-ai/googleai");
const { firebase } = require("@genkit-ai/firebase");

// Correctly configure ts-node to handle TypeScript modules.
require("ts-node").register({
  compilerOptions: {
    module: "commonjs",
    target: "es2017",
  },
});

// Import the TypeScript flows AFTER registering ts-node.
const { generateNewPuzzle } = require("../../src/ai/flows/generate-puzzle.ts");
const { requestPuzzleHint } = require("../../src/ai/flows/generate-hint.ts");

initializeApp();

genkit({
  plugins: [
    googleAI(),
    firebase(),
  ],
  logLevel: "debug",
  enableTracingAndMetrics: true,
});

exports.generateNewPuzzle = onCall(async (request) => {
  const puzzle = await generateNewPuzzle(request.data);
  return puzzle;
});

exports.requestPuzzleHint = onCall(async (request) => {
  const hint = await requestPuzzleHint(request.data);
  return hint;
});
