
import "server-only";
import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { existsSync, readFileSync } from "node:fs";

function getFirebaseAdminApp() {
  const existingApp = getApps().find((app) => app.name === "[DEFAULT]");
  if (existingApp) return existingApp;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (serviceAccountJson?.trim()) {
    let serviceAccount: Record<string, unknown>;

    try {
      serviceAccount = JSON.parse(serviceAccountJson);
    } catch {
      throw new Error(
        "Firebase Admin credentials contain invalid JSON.",
      );
    }

    if (
      typeof serviceAccount.project_id !== "string" ||
      !serviceAccount.project_id.trim() ||
      typeof serviceAccount.client_email !== "string" ||
      !serviceAccount.client_email.trim() ||
      typeof serviceAccount.private_key !== "string" ||
      !serviceAccount.private_key.trim()
    ) {
      throw new Error(
        "Firebase Admin credentials are missing required fields.",
      );
    }

    return initializeApp({
      credential: cert({
        ...serviceAccount,
        private_key: serviceAccount.private_key.replace(/\\n/g, "\n"),
      } as Parameters<typeof cert>[0]),
    });
  }

  if (serviceAccountPath?.trim()) {
    if (!existsSync(serviceAccountPath)) {
      throw new Error(
        "Firebase service-account file was not found. Remove the stale FIREBASE_SERVICE_ACCOUNT_PATH setting to use local ADC.",
      );
    }

    let serviceAccount: Record<string, unknown>;

    try {
      serviceAccount = JSON.parse(
        readFileSync(serviceAccountPath, "utf8"),
      );
    } catch {
      throw new Error(
        "Firebase Admin credentials could not be read. Check the JSON file.",
      );
    }

    if (
      typeof serviceAccount.project_id !== "string" ||
      !serviceAccount.project_id.trim() ||
      typeof serviceAccount.client_email !== "string" ||
      !serviceAccount.client_email.trim() ||
      typeof serviceAccount.private_key !== "string" ||
      !serviceAccount.private_key.trim()
    ) {
      throw new Error(
        "Firebase Admin credentials are missing required fields.",
      );
    }

    return initializeApp({
      credential: cert({
        ...serviceAccount,
        private_key: serviceAccount.private_key.replace(/\\n/g, "\n"),
      } as Parameters<typeof cert>[0]),
    });
  }

  // Local development can use Google Application Default Credentials.
  return initializeApp({
    credential: applicationDefault(),
    projectId: process.env.GOOGLE_CLOUD_PROJECT || "novaflo-dev",
  });
}

export const adminDb = getFirestore(getFirebaseAdminApp());
