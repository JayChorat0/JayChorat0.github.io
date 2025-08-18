
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      // The SDK will automatically discover credentials in a production environment.
      // For local development, you need to set up Application Default Credentials.
      // See: https://firebase.google.com/docs/admin/setup#initialize-sdk
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export const auth = admin.auth();
export const db = admin.firestore();
