import * as geofire from 'geofire-common';
import {
  collection,
  query,
  orderBy,
  startAt,
  endAt,
  getDocs,
  Firestore
} from 'firebase/firestore';

import { spotConverter } from '../Firebase/Firebase';
import { spotsCollectionRef } from '../Consts/SpotsRef';

export const distanceMetres = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const r = 6371; // km
  const p = Math.PI / 180;

  const a =
    0.5 -
    Math.cos((lat2 - lat1) * p) / 2 +
    (Math.cos(lat1 * p) *
      Math.cos(lat2 * p) *
      (1 - Math.cos((lon2 - lon1) * p))) /
      2;

  const result = 2 * r * Math.asin(Math.sqrt(a));
  return result * 1000;
};

export const spotsInRadius = async (
  centre: geofire.Geopoint,
  db: Firestore,
  radiusInM: number = 10000
) => {
  const bounds = geofire.geohashQueryBounds(centre, radiusInM);
  const promises = [];
  for (const b of bounds) {
    const q = query(
      spotsCollectionRef(db),
      orderBy('geohash'),
      startAt(b[0]),
      endAt(b[1])
    ).withConverter(spotConverter);

    promises.push(getDocs(q));
  }

  const snapshots = await Promise.all(promises).catch((e) =>
    console.error('Error retrieving data in bounds', e)
  );

  const matchingDocs = [];
  if (snapshots) {
    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        const location = doc.get('location');

        const distanceInKm = geofire.distanceBetween(
          [location._lat, location._long],
          centre
        );
        const distanceInM = distanceInKm * 1000;
        if (distanceInM <= radiusInM) {
          matchingDocs.push(doc.data());
        }
      }
    }
  }

  return matchingDocs.length ? matchingDocs : [];
};
