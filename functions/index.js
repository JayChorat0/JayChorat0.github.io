
const { onCall } = require("firebase-functions/v2/on_call");
const { initializeApp } = require("firebase-admin/app");

// Correctly configure ts-node to handle TypeScript modules.
require("ts-node").register({
  compilerOptions: {
    module: "commonjs",
    target: "es2017",
     paths: {
      "@/*": ["./src/*"],
    },
    baseUrl: ".",
  },
});

// Import the TypeScript flows AFTER registering ts-node.
const { generateNewPuzzle } = require("../../src/ai/flows/generate-puzzle.ts");
const { requestPuzzleHint } = require("../../src/ai/flows/generate-hint.ts");

initializeApp();

// NOTE: Genkit is now initialized within the imported flows via `src/ai/genkit.ts`
// Do not initialize it here again.

exports.generateNewPuzzle = onCall(async (request) => {
  const puzzle = await generateNewPuzzle(request.data);
  return puzzle;
});

exports.requestPuzzleHint = onCall(async (request) => {
  const hint = await requestPuzzleHint(request.data);
  return hint;
});
