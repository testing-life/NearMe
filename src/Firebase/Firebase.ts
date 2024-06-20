import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  getFirestore
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { ISpot } from '../Models/spot';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DB_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGE_SENDER
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage };

export const spotConverter: FirestoreDataConverter<ISpot> = {
  toFirestore(spot: WithFieldValue<ISpot>): DocumentData {
    return {
      poster: spot.poster,
      tags: spot.tags,
      address: spot.address,
      notes: spot.notes,
      name: spot.name,
      location: spot.location,
      geohash: spot.geohash,
      userId: spot.userId
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): ISpot {
    const data = snapshot.data(options);
    return {
      poster: data.poster,
      tags: data.tags,
      userId: data.userId,
      address: data.address,
      notes: data.notes,
      name: data.name,
      location: data.location,
      id: snapshot.id,
      ref: snapshot.ref,
      geohash: data.hash
    };
  }
};
