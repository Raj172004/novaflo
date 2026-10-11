import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";

function getFirebaseAdminApp() {
  const existingApp = getApps().find((app) => app.name === "[DEFAULT]");
  if (existingApp) return existingApp;

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!serviceAccountPath) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_PATH is not configured.");
  }

  const serviceAccount = JSON.parse(
    readFileSync(serviceAccountPath, "utf8")
  );

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

export const adminDb = getFirestore(getFirebaseAdminApp());
