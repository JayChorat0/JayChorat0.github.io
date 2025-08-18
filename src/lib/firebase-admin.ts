
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // When running in a Google Cloud environment, the credentials will be
    // automatically available. In a local environment, you would need
    // to provide a service account key.
    admin.initializeApp();
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

const auth = admin.auth();
const db = admin.firestore();

export { auth, db };
