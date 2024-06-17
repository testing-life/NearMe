import { Firestore, arrayUnion, doc, setDoc } from 'firebase/firestore';

export const saveTagToSpot = async (
  tag: string,
  uid: string,
  db: Firestore
) => {
  await setDoc(
    doc(db, 'users', uid),
    {
      tags: arrayUnion(tag)
    },
    { merge: true }
  ).catch((error: Error) => console.error(error.message));
};
