import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useGeolocation from "../../Hooks/useGeolocation";
import useReverseGeocode from "../../Hooks/useReverseGeocode";
import { Spot } from "../../Models/spot";
import { blobToBase64 } from "../../Utils/image";
import { GeoPoint } from "firebase/firestore";

const AddSpot = () => {
  const [first, setfirst] = useState("");
  const [spot, setSpot] = useState(Spot.create());
  const { location, error, getLocation } = useGeolocation();
  const { address, getAddress, addressError } = useReverseGeocode();

  const uploadHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const img = await blobToBase64(e.target.files![0]);
    if (img) {
      setSpot({ ...spot, poster: img });
    }
    setfirst(`url(${img}`);
  };

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    console.log("spot", spot);
  };

  useEffect(() => {
    if (location) {
      const geopoint = new GeoPoint(location.latitude, location.longitude);
      setSpot({ ...spot, location: geopoint });
      getAddress(location);
    }
  }, [location]);

  useEffect(() => {
    if (address) {
      setSpot({ ...spot, address: address.formatted });
    }
  }, [address]);

  const guessAddress = (): void => getLocation();

  return (
    <form onSubmit={submitHandler}>
      <div
        style={{
          backgroundSize: "contain",
          backgroundImage: first,
          height: "100px",
          width: "100px",
        }}
      ></div>
      <label htmlFor="poster">Poster</label>
      <input
        type="file"
        id="poster"
        placeholder="image"
        onChange={uploadHandler}
      />
      <label htmlFor="place">Name</label>
      <input
        type="text"
        id="place"
        placeholder="Place's name"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSpot({ ...spot, name: e.target.value })
        }
      />
      <button type="button" onClick={guessAddress}>
        Guess address
      </button>
      <button type="submit">Add</button>
    </form>
  );
};

export default AddSpot;
