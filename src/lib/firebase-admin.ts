
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  // When running locally, you can use a service account file.
  // In a deployed environment (like Firebase Hosting with Cloud Functions, or App Hosting),
  // the SDK will automatically discover credentials.
  // For this project's local dev, we will initialize without explicit credentials,
  // which works in many simplified setups. If this fails, setting
  // GOOGLE_APPLICATION_CREDENTIALS is the definitive solution.
  admin.initializeApp();
}

const auth: admin.auth.Auth = admin.auth();
const db: admin.firestore.Firestore = admin.firestore();

export { auth, db };
