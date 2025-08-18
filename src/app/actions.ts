
"use server";

import { requestPuzzleHint } from "@/ai/flows/generate-hint";
import type { RequestPuzzleHintInput } from "@/ai/flows/generate-hint";
import { auth, db } from "@/lib/firebase-admin"; // We need admin for server-side actions
import { doc, setDoc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
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
        // This is a bit of a hack to sign the user in on the server, then revalidate to refresh client state
        // In a real app, you'd manage session cookies.
        revalidatePath("/", "layout");
        return { success: true, message: 'Registration successful!' };

    } catch (error: any) {
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
        // We can't truly "log in" on the server with client SDK. 
        // We just verify user exists. Client will handle actual login state.
        const user = await auth.getUserByEmail(email);
        // In a real app we would verify password, but admin SDK doesn't do that.
        // The client-side sign-in will handle the password check.
        revalidatePath("/", "layout");
        return { success: true, message: `Welcome back!` };
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            return { success: false, message: 'No user found with this email.' };
        }
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

