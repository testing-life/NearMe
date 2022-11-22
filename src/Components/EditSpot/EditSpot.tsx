import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import useGeolocation from "../../Hooks/useGeolocation";
import useReverseGeocode from "../../Hooks/useReverseGeocode";
import { ISpot, Spot } from "../../Models/spot";
import { GeoPoint } from "firebase/firestore";
import { IKImage, IKUpload } from "imagekitio-react";
import { Tags } from "../../Consts/Tags";

interface Props {
  editHandler: (spot: ISpot) => void;
  cancelHandler: () => void;
  data: Spot;
  userId: string;
}

const EditSpot: FC<Props> = ({ cancelHandler, editHandler, data, userId }) => {
  const [spot, setSpot] = useState(data);
  const { location, error, getLocation } = useGeolocation();
  const { address, getAddress, addressError } = useReverseGeocode();
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    editHandler(spot);
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

  const onError = (err: any) => console.log("upload error", err);
  const onSuccess = (res: any) => {
    setSpot({
      ...spot,
      poster: { ...spot.poster, filePath: res.filePath, url: res.url },
    });
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <IKImage
          lqip={{ active: true, quality: 20 }}
          path={spot.poster.filePath}
        />
        <IKUpload
          value={""}
          fileName={"test.jpg"}
          onError={onError}
          folder={userId}
          onSuccess={onSuccess}
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
          <>
            <div>Tags:</div>
            {Tags.map((tag: string, index: number) => {
              return !spot.tags.includes(tag) ? (
                <button
                  type="button"
                  key={`${tag}${index}`}
                  onClick={() =>
                    setSpot({ ...spot, tags: [...spot.tags, tag] })
                  }
                >
                  {tag} +
                </button>
              ) : (
                <button
                  type="button"
                  key={`${tag}${index}`}
                  onClick={() =>
                    setSpot({
                      ...spot,
                      tags: spot.tags.filter((t) => t !== tag),
                    })
                  }
                >
                  {tag} -
                </button>
              );
            })}
          </>
        </div>
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
        <textarea
          placeholder="Notes"
          value={spot.notes}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setSpot({ ...spot, notes: e.target.value })
          }
        />
        <button type="submit">Edit</button>
      </form>
      <button onClick={cancelHandler} type="button">
        Cancel
      </button>
    </>
  );
};

export default EditSpot;
