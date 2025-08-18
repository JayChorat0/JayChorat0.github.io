
import * as admin from 'firebase-admin';
import { getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let firebaseApp: App;

if (!getApps().length) {
  // By not passing any configuration, the SDK will try to initialize
  // using environment variables or other auto-discovery mechanisms.
  // This is often sufficient in many hosting environments and avoids
  // credential errors in local development.
  firebaseApp = initializeApp();
} else {
  firebaseApp = getApps()[0];
}

const auth: Auth = getAuth(firebaseApp);
const db: Firestore = getFirestore(firebaseApp);

export { auth, db };
