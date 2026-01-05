
const { onCall } = require("firebase-functions/v2/on_call");
const { initializeApp } = require("firebase-admin/app");

// Initialize Firebase app
initializeApp();

// Since we are compiling, we can now directly require the compiled JS files.
const puzzleFunctions = require("./lib/index");

// Export the functions for deployment.
exports.generateNewPuzzle = puzzleFunctions.generateNewPuzzle;
