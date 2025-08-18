
"use server";

import { requestPuzzleHint } from "@/ai/flows/generate-hint";
import type { RequestPuzzleHintInput } from "@/ai/flows/generate-hint";
import { auth, db } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

async function setInitialUserData(userId: string, email: string) {
    const userDocRef = db.collection("users").doc(userId);
    await userDocRef.set({
        email: email,
        score: 0,
        solvedPuzzles: [],
        currentCaseIndex: 0,
        currentPuzzleIndex: 0,
    });
}

export async function registerAction(data: FormData): Promise<{ success: boolean; message: string }> {
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    if (!email || !password) {
        return { success: false, message: 'Email and password are required.' };
    }
    
    try {
        const userRecord = await auth.createUser({ email, password });
        await setInitialUserData(userRecord.uid, email);
        revalidatePath("/", "layout");
        return { success: true, message: 'Registration successful! Please log in.' };

    } catch (error: any) {
        if (error.code === 'auth/email-already-exists') {
            return { success: false, message: 'An account with this email already exists.' };
        }
        console.error("Registration Error:", error);
        return { success: false, message: error.message || 'An unknown error occurred.' };
    }
}


export async function loginAction(data: FormData): Promise<{ success: boolean; message: string }> {
    const email = data.get('email') as string;
    
    if (!email) {
        return { success: false, message: 'Email is required.' };
    }

    try {
        await auth.getUserByEmail(email);
        revalidatePath("/", "layout");
        return { success: true, message: `Welcome back!` };
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            return { success: false, message: 'No user found with this email.' };
        }
        console.error("Login Action Error:", error);
        return { success: false, message: 'Invalid credentials or server error.' };
    }
};

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
