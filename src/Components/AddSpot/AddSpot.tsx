import React, { FC, FormEvent, useEffect, useState } from 'react';
import useGeolocation from '../../Hooks/useGeolocation';
import useReverseGeocode from '../../Hooks/useReverseGeocode';
import { Spot } from '../../Models/spot';
import { GeoPoint } from 'firebase/firestore';
import { Tags } from '../../Consts/Tags';
import Input from '../Input/Input';
import TagButton from '../TagButton/TagButton';
import { auth, storage } from '../../Firebase/Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import TakePhoto from '../TakePhoto/TakePhoto';
import * as geofire from 'geofire-common';
import Button from '../Button/Button';
import { ReactComponent as Locate } from '../../Assets/Icons/locate.svg';
import './AddSpot.css';
import { Link } from 'react-router-dom';
import { HOME } from '../../Consts/Routes';
import { useAddImage } from '../../Hooks/useAddImage';

interface Props {
  submitHandler: (spot: Spot) => void;
  userId: string;
}

const AddSpot: FC<Props> = ({ submitHandler, userId }) => {
  const [spot, setSpot] = useState(Spot.create());
  const [locationMissing, setLocationMissing] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const { location, locationError, getLocation } = useGeolocation();
  const [user] = useAuthState(auth);
  const { address, getAddress, addressError } = useReverseGeocode();
  const { uploadProgress, downloadUrl, uploadError, storageUploadHook } =
    useAddImage();
  // TODO look into making this common - existing hook ?
  const [isSearching, setIsSearching] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!spot.location.latitude && !spot.location.longitude) {
      setLocationMissing(true);
      return;
    }
    const newSpot = { ...spot, userId: user!.uid };
    if (image && user) {
      storageUploadHook(user, storage, image);
    } else {
      submitHandler(newSpot);
    }
  };

  useEffect(() => {
    if (location) {
      const geopoint = new GeoPoint(location.latitude, location.longitude);
      const hash = geofire.geohashForLocation([
        location.latitude,
        location.longitude
      ]);
      setSpot({ ...spot, location: geopoint, geohash: hash });
      getAddress(location);
      setLocationMissing(false);
    }
  }, [location]);

  useEffect(() => {
    if (Object.keys(address).length) {
      setSpot({ ...spot, address: address.formatted });
      setIsSearching(false);
    }
  }, [address]);

  useEffect(() => {
    if (image && downloadUrl) {
      const newSpot = {
        ...spot,
        poster: { ...spot.poster, url: downloadUrl },
        userId: user!.uid
      };
      submitHandler(newSpot);
      // TODO split this
      // BUG submits spot immediately after img upload
    }
  }, [downloadUrl]);

  const guessAddress = (): void => {
    setIsSearching(true);
    getLocation();
  };

  const captureHandler = (data: File | null) => {
    setImage(data);
  };

  const isDefaultLocation = location.latitude === 0 && location.longitude === 0;
  // TODO  almost same form as edit - look into reusing
  // TODO reuse tags filter setup, for layout
  // TODO refactor global utility classes like mb
  return (
    <>
      <TakePhoto
        captureHandler={captureHandler}
        error={uploadError}
        uploadProgress={uploadProgress}
      />
      <form onSubmit={onSubmit}>
        <ul>
          <li className='mb-32'>
            <Input
              id='place'
              required
              label='Name'
              type='text'
              placeholder='place'
              value={spot.name}
              onChange={(value: string) => setSpot({ ...spot, name: value })}
            />
          </li>
          <li className='add-tag mb-32'>
            <ul
              className='add-tag__list'
              style={{ '--n': Tags.length } as React.CSSProperties}>
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
                          tags: spot.tags.filter((t) => t !== tag)
                        })
                      }
                    />
                  </li>
                );
              })}
            </ul>
          </li>
          <li className='row mb-32 locate-container'>
            <div>
              <Input
                id='address'
                required
                label='Address'
                type='text'
                placeholder='Locate me'
                value={spot.address}
                onChange={(value: string) =>
                  setSpot({ ...spot, address: value })
                }
              />
            </div>
            <div className='mb-32'>
              <Button
                classes='add-spot__locate-btn'
                type='button'
                clickHandler={guessAddress}>
                <Locate />
              </Button>
            </div>
            <div>
              {locationMissing && (
                <p className='-is-error'>You need to add a location</p>
              )}
              {locationError && (
                <p className='-is-error'>{locationError.message}</p>
              )}
              {isDefaultLocation && (
                <p className='-is-warning'>
                  You may need to enable Location Services of your device.
                </p>
              )}
              {addressError && (
                <p className='-is-error'>{addressError.message}</p>
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
            <Button fullWidth variant='highlight' type='submit'>
              Add spot
            </Button>
          </li>
        </ul>
      </form>
      <Link className='add-spot__cancel' to={HOME}>
        Cancel
      </Link>
    </>
  );
};

export default AddSpot;
