import { initializeApp } from 'firebase/app';
import {
  getAuth,
} from 'firebase/auth';
import { FirestoreDataConverter, getFirestore, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { Profile } from '../Models/profile';
import { getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DB_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGE_SENDER,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app)
console.log('storage', storage)
export {
  auth,
  db,
  storage,
};