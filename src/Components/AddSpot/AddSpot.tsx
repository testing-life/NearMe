import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import useGeolocation from "../../Hooks/useGeolocation";
import useReverseGeocode from "../../Hooks/useReverseGeocode";
import { Spot } from "../../Models/spot";
import { GeoPoint } from "firebase/firestore";
import { IKImage, IKUpload } from "imagekitio-react";
import { Tags } from "../../Consts/Tags";
import Input from "../Input/Input";
import TagButton from "../TagButton/TagButton";

interface Props {
  submitHandler: (spot: Spot) => void;
  userId: string;
}

const AddSpot: FC<Props> = ({ submitHandler, userId }) => {
  const [spot, setSpot] = useState(Spot.create());
  const { location, error, getLocation } = useGeolocation();
  const { address, getAddress, addressError } = useReverseGeocode();
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

  const onError = (err: any) => console.log("upload error", err);
  const onSuccess = (res: any) => {
    setSpot({
      ...spot,
      poster: { ...spot.poster, filePath: res.filePath, url: res.url },
    });
  };

  return (
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
      <Input
        id="place"
        required
        label="Name"
        type="text"
        placeholder="place"
        value={spot.name}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSpot({ ...spot, name: e.target.value })
        }
      />
      <div>
        <div>Tags:</div>
        <ul className="u-flex u-flex-wrap u-gap-1">
          {Tags.map((tag: typeof Tags[number], index: number) => {
            return !spot.tags.includes(tag) ? (
              <li>
                <TagButton
                  tagLabel={tag}
                  key={`${tag}${index}`}
                  clickHandler={() =>
                    setSpot({ ...spot, tags: [...spot.tags, tag] })
                  }
                />
              </li>
            ) : (
              <li>
                <TagButton
                  remove
                  isSelected
                  tagLabel={tag}
                  key={`${tag}${index}`}
                  clickHandler={() =>
                    setSpot({
                      ...spot,
                      tags: spot.tags.filter((t) => t !== tag),
                    })
                  }
                />
              </li>
            );
          })}
        </ul>
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
      <button type="submit">Add</button>
    </form>
  );
};

export default AddSpot;
