
const { onCall } = require("firebase-functions/v2/on_call");
const { initializeApp } = require("firebase-admin/app");

// Initialize Firebase app
initializeApp();

// Since we are compiling, we can now directly require the compiled JS files.
const puzzleFunctions = require("./lib/puzzle-functions");

// Export the functions for deployment.
exports.generateNewPuzzle = onCall(puzzleFunctions.generateNewPuzzle);
exports.requestPuzzleHint = onCall(puzzleFunctions.requestPuzzleHint);
