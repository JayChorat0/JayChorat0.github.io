
"use server";

import type { RequestPuzzleHintInput } from "@/ai/flows/generate-hint";
import { requestPuzzleHint } from "@/ai/flows/generate-hint";
import { generateNewPuzzle, GenerateNewPuzzleInput } from "@/ai/flows/generate-puzzle";
import { Puzzle } from "@/lib/cases";


export async function getHintAction(input: RequestPuzzleHintInput): Promise<{ hint: string } | { error: string }> {
  try {
    const result = await requestPuzzleHint({
        puzzleDescription: input.puzzleDescription,
        userProgress: input.userProgress || "The user has not tried anything yet."
    });
    if (!result.hint) {
        return { error: 'Could not generate a hint at this time.'}
    }
    return { hint: result.hint };
  } catch (e) {
    console.error(e);
    return { error: "Failed to generate a hint. The AI model might be unavailable." };
  }
}

export async function generateNewPuzzleAction(input: GenerateNewPuzzleInput): Promise<{ puzzle: Puzzle } | { error: string }> {
  try {
    const puzzle = await generateNewPuzzle(input);
    if (!puzzle) {
        return { error: 'Could not generate a new puzzle at this time.'}
    }
    return { puzzle };
  } catch (e) {
    console.error(e);
    return { error: "Failed to generate a new puzzle. The AI model might be unavailable." };
  }
}
