import React, { useState } from 'react';

export interface Ilocation {
  latitude: number;
  longitude: number;
}

interface Ihook {
  locationError: GeolocationPositionError;
  location: Ilocation;
  getLocation: () => void;
}

const useGeolocation = (): Ihook => {
  const [location, setLocation] = useState<
    Pick<GeolocationCoordinates, 'latitude' | 'longitude'>
  >({ latitude: 0, longitude: 0 });
  const [locationError, setLocationError] = useState<GeolocationPositionError>(
    {} as GeolocationPositionError
  );

  const onChange = ({ coords }: GeolocationPosition) => {
    if (coords) {
      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude
      });
    }
  };

  const onError = (error: GeolocationPositionError) => setLocationError(error);

  const getLocation = () =>
    navigator.geolocation.getCurrentPosition(onChange, onError, {
      enableHighAccuracy: true
    });

  return { location, getLocation, locationError };
};

export default useGeolocation;
