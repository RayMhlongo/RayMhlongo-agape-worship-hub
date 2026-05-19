"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
  type Auth
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  type Firestore
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

export const hasFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

export function getFirebase() {
  if (!hasFirebaseConfig) return null;
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  void setPersistence(auth, browserLocalPersistence);
  return { app, auth, db, storage };
}

export const authActions = {
  async google() {
    const firebase = getFirebase();
    if (!firebase) throw new Error("Firebase environment variables are not configured.");
    return signInWithPopup(firebase.auth, new GoogleAuthProvider());
  },
  async email(email: string, password: string) {
    const firebase = getFirebase();
    if (!firebase) throw new Error("Firebase environment variables are not configured.");
    return signInWithEmailAndPassword(firebase.auth, email, password);
  },
  async register(email: string, password: string) {
    const firebase = getFirebase();
    if (!firebase) throw new Error("Firebase environment variables are not configured.");
    return createUserWithEmailAndPassword(firebase.auth, email, password);
  },
  async logout() {
    const firebase = getFirebase();
    if (!firebase) return;
    return signOut(firebase.auth);
  }
};

export function subscribeCollection<T>(path: string, callback: (items: T[]) => void) {
  const firebase = getFirebase();
  if (!firebase) return () => undefined;
  const q = query(collection(firebase.db, path), orderBy("title"));
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T)));
}

export async function saveDocument<T extends { id?: string }>(path: string, item: T) {
  const firebase = getFirebase();
  if (!firebase) throw new Error("Firebase environment variables are not configured.");
  if (item.id) {
    await setDoc(doc(firebase.db, path, item.id), item, { merge: true });
    return item.id;
  }
  const refDoc = await addDoc(collection(firebase.db, path), item);
  return refDoc.id;
}

export async function removeDocument(path: string, id: string) {
  const firebase = getFirebase();
  if (!firebase) throw new Error("Firebase environment variables are not configured.");
  await deleteDoc(doc(firebase.db, path, id));
}

export async function uploadPdfBackground(file: File) {
  const firebase = getFirebase();
  if (!firebase) throw new Error("Firebase environment variables are not configured.");
  const storageRef = ref(firebase.storage, `pdf-backgrounds/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
