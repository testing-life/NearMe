import { useState } from 'react';
import { Ilocation } from './useGeolocation';
import { reverseGeocodeUrl } from '../Utils/geo';

interface Ihook {
  addressError: Error | undefined;
  address: { [key: string]: string };
  getAddress: (location: Ilocation) => Promise<void>;
}

const useReverseGeocode = (): Ihook => {
  const [address, setAddress] = useState({});
  const [addressError, setAddressError] = useState<Error>();

  const getAddress = async (location: Ilocation): Promise<void> => {
    const requestUrl = reverseGeocodeUrl(location);
    const res = await fetch(requestUrl, { method: 'GET' }).catch(
      (error: Error) => setAddressError(error)
    );

    if (res?.ok) {
      const data = await res.json();
      setAddress(data.features[0].properties);
    }
  };
  return { address, getAddress, addressError };
};

export default useReverseGeocode;
