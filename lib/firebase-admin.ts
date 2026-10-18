import { mockDb } from './adapters/mock-firestore';

let dbInstance: any;
try {
  const admin = require('firebase-admin');
  if (!admin.apps.length) {
    admin.initializeApp();
  }
  dbInstance = admin.firestore();
} catch (e) {
  console.warn('Using mock Firestore adapter due to missing or restricted Firebase credentials.');
  dbInstance = mockDb;
}

export const db = dbInstance;
export const adminDb = dbInstance;
