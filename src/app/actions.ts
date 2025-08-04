 "use server";

import { requestPuzzleHint } from "@/ai/flows/generate-hint";
import type { RequestPuzzleHintInput } from "@/ai/flows/generate-hint";

export async function getHintAction(input: RequestPuzzleHintInput): Promise<{ hint: string } | { error: string }> {
  try {
    // Add a delay to simulate a real AI call
    await new Promise(resolve => setTimeout(resolve, 1000));
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

export async function loginAction(data: FormData): Promise<{ success: boolean; message: string }>{
    const username = data.get('username');
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In a real app, you'd validate this against a database.
    if (username) {
        return { success: true, message: `Welcome, ${username}!` };
    }
    return { success: false, message: 'Invalid credentials' };
};
