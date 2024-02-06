import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import useGeolocation from "../../Hooks/useGeolocation";
import useReverseGeocode from "../../Hooks/useReverseGeocode";
import { ISpot, Spot } from "../../Models/spot";
import { GeoPoint } from "firebase/firestore";
import { Tags } from "../../Consts/Tags";
import Input from "../Input/Input";
import TagButton from "../TagButton/TagButton";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, storage } from "../../Firebase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import TakePhoto from "../TakePhoto/TakePhoto";
import * as geofire from "geofire-common";
import Button from "../Button/Button";
import { ReactComponent as Locate } from "../../Assets/Icons/locate.svg";
import "./AddSpot.css";

interface Props {
  submitHandler: (spot: Spot) => void;
  userId: string;
}

const AddSpot: FC<Props> = ({ submitHandler, userId }) => {
  const [uploadError, setUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [spot, setSpot] = useState(Spot.create());
  const [image, setImage] = useState<File | null>(null);
  const { location, locationError, getLocation } = useGeolocation();
  const [user] = useAuthState(auth);
  const { address, getAddress, addressError } = useReverseGeocode();
  // TODO look into making this common - existing hook ?
  const [isSearching, setIsSearching] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newSpot = { ...spot, userId: user!.uid };
    if (image) {
      storageUpload(image, newSpot as ISpot);
    } else {
      submitHandler(newSpot);
    }
  };

  useEffect(() => {
    if (location) {
      const geopoint = new GeoPoint(location.latitude, location.longitude);
      const hash = geofire.geohashForLocation([
        location.latitude,
        location.longitude,
      ]);
      setSpot({ ...spot, location: geopoint, geohash: hash });
      getAddress(location);
    }
  }, [location]);

  useEffect(() => {
    if (Object.keys(address).length) {
      setSpot({ ...spot, address: address.formatted });
      setIsSearching(false);
    }
  }, [address]);

  const guessAddress = (): void => {
    setIsSearching(true);
    getLocation();
  };

  const storageUpload = (data: File, spotWithId: ISpot) => {
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
            ...spotWithId,
            poster: { ...spotWithId.poster, url: downloadUrl },
          };
          // TODO split this
          // BUG submits spot immediately after img upload
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
    // TODO ugly fix for upload
    storageUpload(file, {} as ISpot);
  };

  const captureHandler = (data: File | null) => {
    setImage(data);
  };
  // TODO  almost same form as edit - look into reusing
  // TODO reuse tags filter setup, for layout
  // TODO refactor global utility classes like mb
  return (
    <>
      <TakePhoto
        captureHandler={captureHandler}
        uploadHandler={uploadHandler}
        error={uploadError}
        uploadProgress={uploadProgress}
      />
      <form onSubmit={onSubmit}>
        <ul>
          <li className="mb-32">
            <Input
              id="place"
              required
              label="Name"
              type="text"
              placeholder="place"
              value={spot.name}
              onChange={(value: string) => setSpot({ ...spot, name: value })}
            />
          </li>
          <li className="add-tag mb-32">
            <ul
              className="add-tag__list"
              style={{ "--n": Tags.length } as React.CSSProperties}
            >
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
          <li className="row mb-32 locate-container">
            <div>
              <Input
                id="address"
                required
                label="Address"
                type="text"
                placeholder="Add address or locate me"
                value={spot.address}
                onChange={(value: string) =>
                  setSpot({ ...spot, address: value })
                }
              />
            </div>
            <div>
              <Button
                classes="add-spot__locate-btn"
                type="button"
                clickHandler={guessAddress}
              >
                <Locate />
              </Button>

              {locationError && (
                <p className="-is-serror">{locationError.message}</p>
              )}
              {addressError && (
                <p className="-is-serror">{addressError.message}</p>
              )}
            </div>
          </li>
          {/* really needed ? */}
          {/* <li className="mb-3">
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
          </li> */}
          <li>
            <Button fullWidth variant="highlight" type="submit">
              Add spot
            </Button>
          </li>
        </ul>
      </form>
    </>
  );
};

export default AddSpot;
