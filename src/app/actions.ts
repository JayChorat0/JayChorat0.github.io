
"use server";

import type { RequestPuzzleHintInput } from "@/ai/flows/generate-hint";
import { requestPuzzleHint } from "@/ai/flows/generate-hint";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase-admin";


/**
 * Sets the initial user data in Firestore after registration.
 */
export async function createInitialUserData(userId: string, email: string): Promise<{ success: boolean; message: string }> {
    if (!userId || !email) {
        return { success: false, message: 'User ID and email are required.' };
    }
    try {
        const userDocRef = db.collection("users").doc(userId);
        await userDocRef.set({
            email: email,
            score: 0,
            solvedPuzzles: [],
            currentCaseIndex: 0,
            currentPuzzleIndex: 0,
        });
        revalidatePath("/", "layout");
        return { success: true, message: 'User data created successfully.' };
    } catch (error: any) {
        console.error("Error creating user data:", error);
        // Provide a more specific error message if available
        const errorMessage = error.message || 'An unknown error occurred creating user data.';
        return { success: false, message: `Server error: ${errorMessage}` };
    }
}


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

export async function getGameState(userId: string) {
    try {
        const userDocRef = db.collection("users").doc(userId);
        const userDoc = await userDocRef.get();
        if (userDoc.exists) {
            const data = userDoc.data();
            // Ensure all fields have default values if they are missing
            return {
                currentCaseIndex: data?.currentCaseIndex ?? 0,
                currentPuzzleIndex: data?.currentPuzzleIndex ?? 0,
                score: data?.score ?? 0,
                solvedPuzzles: data?.solvedPuzzles ?? [],
            };
        }
        return null;
    } catch (error) {
        console.error("Error getting game state:", error);
        return null;
    }
}

export async function updateGameState(userId: string, newState: any) {
    try {
        const userDocRef = db.collection("users").doc(userId);
        await userDocRef.set(newState, { merge: true });
        revalidatePath("/play");
    } catch (error) {
        console.error("Error updating game state:", error);
    }
}
