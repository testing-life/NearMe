import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import useGeolocation from "../../Hooks/useGeolocation";
import useReverseGeocode from "../../Hooks/useReverseGeocode";
import { Spot } from "../../Models/spot";
import { GeoPoint } from "firebase/firestore";
import { Tags } from "../../Consts/Tags";
import Input from "../Input/Input";
import TagButton from "../TagButton/TagButton";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, storage } from "../../Firebase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import TakePhoto from "../TakePhoto/TakePhoto";

interface Props {
  submitHandler: (spot: Spot) => void;
  userId: string;
}

const AddSpot: FC<Props> = ({ submitHandler, userId }) => {
  const [uploadError, setUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [spot, setSpot] = useState(Spot.create());
  const [image, setImage] = useState<File | null>(null);
  const { location, error, getLocation } = useGeolocation();
  const [user] = useAuthState(auth);
  const { address, getAddress, addressError } = useReverseGeocode();
  // TODO look into making this common - existing hook ?
  const [isSearching, setIsSearching] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (image) {
      storageUpload(image);
    } else {
      submitHandler(spot);
    }
  };

  useEffect(() => {
    if (location) {
      setIsSearching(true);
      const geopoint = new GeoPoint(location.latitude, location.longitude);
      setSpot({ ...spot, location: geopoint });
      getAddress(location);
    }
  }, [location]);

  useEffect(() => {
    if (address) {
      setSpot({ ...spot, address: address.formatted });
      setIsSearching(false);
    }
  }, [address]);

  const guessAddress = (): void => getLocation();

  const storageUpload = (data: File) => {
    const storageRef = ref(storage, `${user?.uid || "img"}/${data.name}`);
    const uploadTask = uploadBytesResumable(storageRef, data);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      },
      (error) => {
        setUploadError(`${error.cause} ${error.message}`);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        if (downloadUrl) {
          const imagedSpot = {
            ...spot,
            poster: { ...spot.poster, url: downloadUrl },
          };
          // TODO split this method
          submitHandler(imagedSpot);
        }
      }
    );
  };

  const uploadHandler = (e: ChangeEvent) => {
    e.preventDefault();
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }
    storageUpload(file);
  };

  const captureHandler = (data: File | null) => {
    setImage(data);
  };
  // TODO  almost same form as edit - look into reusing
  return (
    <>
      <TakePhoto captureHandler={captureHandler} />
      <form onSubmit={onSubmit}>
        <ul className="p-0 m-0">
          <li className="mb-3">
            <input type="file" onChange={uploadHandler} />
            {uploadProgress && uploadProgress !== 100 && !spot.poster.url ? (
              <>
                {uploadProgress} <progress value={uploadProgress}></progress>
              </>
            ) : null}
            {uploadError && <p className="text-orange-600">t{uploadError}</p>}
          </li>
          <li className="mb-3">
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
          </li>
          <li className="mb-3">
            <span>Tags:</span>
            <ul className="u-flex u-flex-wrap u-gap-1">
              {Tags.map((tag: (typeof Tags)[number], index: number) => {
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
          </li>
          <li className="row u-items-flex-end u-gap-2">
            <div className="col p-0">
              <Input
                id="address"
                required
                label="Address"
                type="text"
                placeholder="address"
                value={spot.address}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSpot({ ...spot, address: e.target.value })
                }
              />
            </div>
            <div className="col p-0">
              <button type="button" onClick={guessAddress}>
                Guess address
              </button>
              {addressError && (
                <p className="text-orange-600">{addressError.message}</p>
              )}
            </div>
          </li>
          <li className="mb-3">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              className="bg-light"
              placeholder="Notes"
              value={spot.notes}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setSpot({ ...spot, notes: e.target.value })
              }
            />
          </li>
          <li>
            <button
              className="bg-primary lg border-red-800 text-light"
              type="submit"
            >
              Add
            </button>
          </li>
        </ul>
      </form>
    </>
  );
};

export default AddSpot;
