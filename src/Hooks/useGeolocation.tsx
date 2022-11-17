import React, { useState } from "react";

export interface Ilocation {
  latitude: number;
  longitude: number;
}

interface Ihook {
  error: GeolocationPositionError;
  location: Ilocation;
  getLocation: () => void;
}

const useGeolocation = (): Ihook => {
  const [location, setLocation] = useState<
    Pick<GeolocationCoordinates, "latitude" | "longitude">
  >({ latitude: 0, longitude: 0 });
  const [error, setError] = useState<GeolocationPositionError>(
    {} as GeolocationPositionError
  );

  const onChange = ({ coords }: GeolocationPosition) => {
    if (coords) {
      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    }
  };

  const onError = (error: GeolocationPositionError) => setError(error);

  const getLocation = () =>
    navigator.geolocation.getCurrentPosition(onChange, onError);

  return { location, getLocation, error };
};

export default useGeolocation;
