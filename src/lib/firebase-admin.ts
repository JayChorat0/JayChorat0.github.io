
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // When running in a Google Cloud environment, the credentials will be
    // automatically available.
    admin.initializeApp();
  } catch (error) {
    console.log('Firebase admin initialization error', error);
  }
}

export const auth = admin.auth();
export const db = admin.firestore();
