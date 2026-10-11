
import "server-only";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";

function getFirebaseAdminApp() {
  const existingApp = getApps().find(
    (app) => app.name === "[DEFAULT]",
  );

  if (existingApp) return existingApp;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  let serviceAccount: Record<string, unknown>;

  if (serviceAccountJson) {
    serviceAccount = JSON.parse(serviceAccountJson);
  } else if (serviceAccountPath) {
    serviceAccount = JSON.parse(
      readFileSync(serviceAccountPath, "utf8"),
    );
  } else {
    throw new Error(
      "Configure FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH.",
    );
  }

  return initializeApp({
    credential: cert(
      serviceAccount as Parameters<typeof cert>[0],
    ),
  });
}

export const adminDb = getFirestore(getFirebaseAdminApp());
