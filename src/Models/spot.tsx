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
}

export class Spot {
  id = '';
  ref = {};
  poster = { url: '' };
  tags: string[] = [];
  address: string = '';
  notes: string = '';
  name: string = '';
  geohash: string = '';
  userId: string = '';
  location: Ilocation = new GeoPoint(0, 0);
  static create(): Spot {
    return new Spot();
  }
}
