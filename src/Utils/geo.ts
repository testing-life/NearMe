import * as geofire from 'geofire-common';
import {
  query,
  orderBy,
  startAt,
  endAt,
  getDocs,
  Firestore
} from 'firebase/firestore';

import { spotConverter } from '../Firebase/Firebase';
import { spotsCollectionRef } from '../Consts/SpotsRef';
import { User } from 'firebase/auth';
import { Ilocation } from '../Hooks/useGeolocation';

export function distanceMetres(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance * 1000;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export const spotsInRadius = async (
  centre: geofire.Geopoint,
  db: Firestore,
  radiusInM: number = 10000,
  user?: User
) => {
  const bounds = geofire.geohashQueryBounds(centre, radiusInM);
  const promises = [];
  for (const b of bounds) {
    const q = user
      ? query(
          spotsCollectionRef(db),
          // where('userId', '==', user.uid), // why doesnt this filter work?
          orderBy('geohash'),
          startAt(b[0]),
          endAt(b[1])
        ).withConverter(spotConverter)
      : query(
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

export const isDefaultLocation = (location: Ilocation) =>
  location.latitude === 0 && location.longitude === 0;
