import { DocumentData, DocumentReference, GeoPoint } from 'firebase/firestore';
import { Ilocation } from '../Hooks/useGeolocation';

export interface ISpot {
  poster: { url: string };
  tags: string[];
  address: string;
  notes: string;
  location: Ilocation;
  name: string;
  id: string;
  ref: DocumentReference<DocumentData>;
  geohash: string;
  userId: string;
  others?: boolean;
}

const mockDocRef = {} as DocumentReference<DocumentData>;

export const DefaultSpot: ISpot = {
  id: '',
  ref: mockDocRef,
  poster: { url: '' },
  tags: [],
  address: '',
  notes: '',
  name: '',
  geohash: '',
  userId: '',
  location: new GeoPoint(0, 0),
};
