
import { onCall } from "firebase-functions/v2/on_call";
import { initializeApp } from "firebase-admin/app";

// Initialize Firebase app
initializeApp();

// Import the AI flows
import { generateNewPuzzle } from "../src/ai/flows/generate-puzzle";
import { requestPuzzleHint } from "../src/ai/flows/generate-hint";

// Export the functions for deployment.
exports.generateNewPuzzle = onCall(generateNewPuzzle);
exports.requestPuzzleHint = onCall(requestPuzzleHint);
