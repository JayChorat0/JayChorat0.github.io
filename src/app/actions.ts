
"use server";

import type { RequestPuzzleHintInput } from "@/ai/flows/generate-hint";
import { requestPuzzleHint } from "@/ai/flows/generate-hint";
import { revalidatePath } from "next/cache";

// This function is no longer needed as the client will create the user document.

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

// We will fetch game state from the client side now.
// The updateGameState will also move to the client side.

