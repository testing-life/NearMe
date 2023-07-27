import React, {
  ChangeEvent,
  FC,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import useGeolocation from "../../Hooks/useGeolocation";
import useReverseGeocode from "../../Hooks/useReverseGeocode";
import { Spot } from "../../Models/spot";
import { GeoPoint } from "firebase/firestore";
import { IKImage, IKUpload } from "imagekitio-react";
import { Tags } from "../../Consts/Tags";
import Input from "../Input/Input";
import TagButton from "../TagButton/TagButton";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../Firebase/Firebase";

interface Props {
  submitHandler: (spot: Spot) => void;
  userId: string;
}

const AddSpot: FC<Props> = ({ submitHandler, userId }) => {
  const [uploadError, setUploadError] = useState("");
  const [spot, setSpot] = useState(Spot.create());
  const { location, error, getLocation } = useGeolocation();
  const { address, getAddress, addressError } = useReverseGeocode();
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitHandler(spot);
  };

  const fileInput = useRef();

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

  const onError = (err: any) => setUploadError(err.message);
  const onSuccess = (res: any) => {
    if (uploadError) {
      setUploadError("");
    }
    setSpot({
      ...spot,
      poster: { ...spot.poster, filePath: res.filePath, url: res.url },
    });
  };

  const uploadHandler = (e: any) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    console.log("storage", storage);
    const storageRef = ref(storage, `test/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log("progress", progress);
      },
      (error) => {
        console.error(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("downloadUrl", downloadUrl);
      }
    );
    console.log("e", e.target.files, e);
  };

  return (
    <form onSubmit={onSubmit}>
      <ul className="p-0 m-0">
        <li className="mb-3">
          <input type="file" onChange={uploadHandler} />
          {uploadError && <p className="text-orange-600">{uploadError}</p>}
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
  );
};

export default AddSpot;
