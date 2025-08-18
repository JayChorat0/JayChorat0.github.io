
"use server";

import { requestPuzzleHint } from "@/ai/flows/generate-hint";
import type { RequestPuzzleHintInput } from "@/ai/flows/generate-hint";
import { auth, db } from "@/lib/firebase-admin"; // We need admin for server-side actions
import { doc, setDoc, getDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

async function setInitialUserData(userId: string, email: string) {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, {
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
        const userCredential = await auth.createUser({ email, password });
        await setInitialUserData(userCredential.uid, email);
        // This won't sign the user in on the client, but it prepares their account.
        // The client will need to sign in separately after registration.
        revalidatePath("/", "layout");
        return { success: true, message: 'Registration successful! Please log in.' };

    } catch (error: any) {
        if (error.code === 'auth/email-already-exists') {
            return { success: false, message: 'An account with this email already exists.' };
        }
        return { success: false, message: error.message || 'An unknown error occurred.' };
    }
}


export async function loginAction(data: FormData): Promise<{ success: boolean; message: string }> {
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    if (!email || !password) {
        return { success: false, message: 'Email and password are required.' };
    }

    try {
        // The admin SDK cannot verify passwords. The client-side sign-in will handle the password check.
        // We just verify the user exists to provide a better UX.
        await auth.getUserByEmail(email);
        revalidatePath("/", "layout");
        return { success: true, message: `Welcome back!` };
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            return { success: false, message: 'No user found with this email.' };
        }
        // Don't leak specific error info
        return { success: false, message: 'Invalid credentials or server error.' };
    }
};

export async function getHintAction(input: RequestPuzzleHintInput): Promise<{ hint: string } | { error: string }> {
  try {
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

export async function getGameState(userId: string) {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        return userDoc.data();
    }
    return null;
}

export async function updateGameState(userId: string, newState: any) {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, newState, { merge: true });
    revalidatePath("/play");
}
