import "server-only";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";

function getFirebaseAdminApp() {
  const existingApp = getApps().find((app) => app.name === "[DEFAULT]");
  if (existingApp) return existingApp;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  let serviceAccount: Record<string, unknown>;

  try {
    if (serviceAccountJson?.trim()) {
      serviceAccount = JSON.parse(serviceAccountJson);
    } else if (serviceAccountPath?.trim()) {
      serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
    } else {
      throw new Error(
        "Configure FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH.",
      );
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("Configure FIREBASE_SERVICE_ACCOUNT")
    ) {
      throw error;
    }

    throw new Error(
      "Firebase Admin credentials could not be loaded. Check the JSON format and service-account file path.",
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
      "Firebase Admin credentials are missing project_id, client_email, or private_key.",
    );
  }

  // Normalize private-key newlines supplied through environment variables.
  const normalizedServiceAccount = {
    ...serviceAccount,
    private_key: serviceAccount.private_key.replace(/\\n/g, "\n"),
  };

  return initializeApp({
    credential: cert(
      normalizedServiceAccount as Parameters<typeof cert>[0],
    ),
  });
}

export const adminDb = getFirestore(getFirebaseAdminApp());
