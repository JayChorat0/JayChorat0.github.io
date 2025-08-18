
import * as admin from 'firebase-admin';

let app: admin.app.App;

function initializeAdminApp() {
  if (!admin.apps.length) {
    try {
      app = admin.initializeApp({
        // The SDK will automatically discover credentials in a production environment.
        // For local development, you need to set up Application Default Credentials.
        // See: https://firebase.google.com/docs/admin/setup#initialize-sdk
      });
    } catch (error: any) {
      console.error('Firebase admin initialization error', error.stack);
      throw new Error('Failed to initialize Firebase Admin SDK');
    }
  } else {
    app = admin.app();
  }
  return app;
}

// Initialize on first load.
initializeAdminApp();

export const db = admin.firestore();
export const auth = admin.auth();
