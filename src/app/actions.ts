
"use server";

import type { RequestPuzzleHintInput } from "@/ai/flows/generate-hint";
import { requestPuzzleHint } from "@/ai/flows/generate-hint";
import { revalidatePath } from "next/cache";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "@/lib/firebase";


const db = getFirestore(app);


/**
 * Sets the initial user data in Firestore after registration.
 */
export async function createInitialUserData(userId: string, email: string): Promise<{ success: boolean; message: string }> {
    if (!userId || !email) {
        return { success: false, message: 'User ID and email are required.' };
    }
    try {
        const userDocRef = doc(db, "users", userId);
        await setDoc(userDocRef, {
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
        return { success: false, message: error.message || 'An unknown error occurred creating user data.' };
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
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
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
        const userDocRef = doc(db, "users", userId);
        await setDoc(userDocRef, newState, { merge: true });
        revalidatePath("/play");
    } catch (error) {
        console.error("Error updating game state:", error);
    }
}
