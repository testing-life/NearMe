import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import useGeolocation from "../../Hooks/useGeolocation";
import useReverseGeocode from "../../Hooks/useReverseGeocode";
import { Spot } from "../../Models/spot";
import { blobToBase64 } from "../../Utils/image";
import { GeoPoint } from "firebase/firestore";

interface Props {
  submitHandler: (spot: Spot) => void;
}

const AddSpot: FC<Props> = ({ submitHandler }) => {
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

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitHandler(spot);
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
    <form onSubmit={onSubmit}>
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
        required
        placeholder="image"
        onChange={uploadHandler}
      />
      <label htmlFor="place">Name</label>
      <input
        type="text"
        id="place"
        required
        value={spot.name}
        placeholder="Place's name"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSpot({ ...spot, name: e.target.value })
        }
      />
      <div>
        <label htmlFor="address">Address</label>
        <input
          value={spot.address}
          type="string"
          placeholder="This places address"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSpot({ ...spot, address: e.target.value })
          }
        />
        <button type="button" onClick={guessAddress}>
          Guess address
        </button>
      </div>
      <button type="submit">Add</button>
    </form>
  );
};

export default AddSpot;
