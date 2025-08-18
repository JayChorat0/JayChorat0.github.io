
import * as admin from 'firebase-admin';
import { getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let firebaseApp: App;

if (!getApps().length) {
  firebaseApp = initializeApp({
    credential: admin.credential.applicationDefault(),
  });
} else {
  firebaseApp = getApps()[0];
}

const auth: Auth = getAuth(firebaseApp);
const db: Firestore = getFirestore(firebaseApp);

export { auth, db };
