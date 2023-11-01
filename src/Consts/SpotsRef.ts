import { Firestore, collection, doc } from 'firebase/firestore';

export const spotsCollectionRef = (db: Firestore) => collection(db, 'spots');
export const spotsDocRef = (db: Firestore, id: string) => doc(db, 'spots', id);
