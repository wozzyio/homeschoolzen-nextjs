import * as firebaseAdmin from 'firebase-admin';

// get this JSON from the Firebase board
// you can also store the values in environment variables
import serviceAccount from './secret.json';

export const verifyIdToken = (token) => {
    if (!firebaseAdmin.apps.length) {
        firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert({
                privateKey: serviceAccount.private_key,
                clientEmail: serviceAccount.client_email,
                projectId: serviceAccount.project_id,
            }),
            databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        });
    }
    return firebaseAdmin.auth().verifyIdToken(token).catch((error) => {
        throw error
    })
}
