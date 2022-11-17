import React, { useState } from "react";
import { Requests } from "../../Consts/Requests";
import { Ilocation } from "./useGeolocation";

interface Ihook {
  addressError: Error | undefined;
  address: { [key: string]: string };
  getAddress: (location: Ilocation) => Promise<void>;
}

const useReverseGeocode = (): Ihook => {
  const [address, setAddress] = useState({});
  const [addressError, setAddressError] = useState<Error>();

  const getAddress = async (location: Ilocation): Promise<void> => {
    const requestUrl = `${Requests.ReverseGeocodeUrl}lat=${location.latitude}&lon=${location.longitude}&apiKey=${process.env.REACT_APP_REVERSE_GEOCODE_API}`;
    const res = await fetch(requestUrl, { method: "GET" }).catch(
      (error: Error) => setAddressError(error)
    );

    if (res && res.ok) {
      const data = await res.json();
      setAddress(data.features[0].properties);
    }
  };
  return { address, getAddress, addressError };
};

export default useReverseGeocode;
