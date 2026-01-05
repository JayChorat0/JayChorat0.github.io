
import { onCall } from "firebase-functions/v2/on_call";
import { initializeApp } from "firebase-admin/app";
import { GenerateNewPuzzleInput, GenerateNewPuzzleOutput, RequestPuzzleHintInput, RequestPuzzleHintOutput } from "@/lib/types";

// Initialize Firebase app FIRST
initializeApp();

// This is necessary because Genkit's defineFlow registers the flow globally.
// By importing them here AFTER initialization, they become available to the
// Genkit ecosystem when the function is initialized.
import { generateNewPuzzle as generateNewPuzzleFlow } from "../src/ai/flows/generate-puzzle";
import { requestPuzzleHint as requestPuzzleHintFlow } from "../src/ai/flows/generate-hint";

import './src/ai/firebase'; 

// Export the functions for deployment.
export const generateNewPuzzle = onCall<GenerateNewPuzzleInput, Promise<GenerateNewPuzzleOutput>>(generateNewPuzzleFlow);
export const requestPuzzleHint = onCall<RequestPuzzleHintInput, Promise<RequestPuzzleHintOutput>>(requestPuzzleHintFlow);
