
const {onCall} = require("firebase-functions/v2/https");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const {defineString} = require('firebase-functions/params');

const {generateNewPuzzle} = require('../src/ai/flows/generate-puzzle');
const {requestPuzzleHint} = require('../src/ai/flows/generate-hint');

// Initialize Firebase
initializeApp();

// Genkit-related initialization.
require('dotenv').config();
require('../src/ai/dev');


// Define environment variables
const GCLOUD_API_KEY = defineString('GCLOUD_API_KEY');

exports.generateNewPuzzle = onCall({ secrets: ["GCLOUD_API_KEY"] }, async (request) => {
    process.env.GCLOUD_API_KEY = GCLOUD_API_KEY.value();
    const { lastCaseDescription, existingSolutions } = request.data;
    try {
        const puzzle = await generateNewPuzzle({ lastCaseDescription, existingSolutions });
        return { puzzle };
    } catch (e) {
        console.error(e);
        return { error: "Failed to generate new puzzle." };
    }
});

exports.requestPuzzleHint = onCall({ secrets: ["GCLOUD_API_KEY"] }, async (request) => {
    process.env.GCLOUD_API_KEY = GCLOUD_API_KEY.value();
    const { puzzleDescription, userProgress } = request.data;
    try {
        const hint = await requestPuzzleHint({ puzzleDescription, userProgress });
        return hint;
    } catch (e) {
        console.error(e);
        return { error: "Failed to generate hint." };
    }
});
