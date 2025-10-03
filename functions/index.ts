
import { onCall } from "firebase-functions/v2/on_call";
import { initializeApp } from "firebase-admin/app";

// Initialize Firebase app
initializeApp();

// Import the AI flows
import { generateNewPuzzle } from "../src/ai/flows/generate-puzzle";
import { requestPuzzleHint } from "../src/ai/flows/generate-hint";

// This is necessary because Genkit's defineFlow registers the flow globally.
// By importing them here, they become available to the Genkit ecosystem
// when the function is initialized.
import '../src/ai/genkit'; 

// Export the functions for deployment.
exports.generateNewPuzzle = onCall(generateNewPuzzle);
exports.requestPuzzleHint = onCall(requestPuzzleHint);
