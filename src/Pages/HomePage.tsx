import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ADD } from '../Consts/Routes';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, db, spotConverter } from '../Firebase/Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  DocumentReference,
  arrayUnion,
  deleteDoc,
  doc,
  query,
  setDoc,
  where
} from 'firebase/firestore';
import { ISpot } from '../Models/spot';
import Header from '../Components/Header/Header';
import './HomePage.css';
import TagFilter from '../Components/TagFilter/TagFilter';
import { filterByArray } from '../Utils/array';
import ListView from '../Components/ListView/ListView';
import MapView from '../Components/MapView/MapView';
import { spotsInRadius } from '../Utils/geo';
import useGeolocation from '../Hooks/useGeolocation';
import { spotsCollectionRef } from '../Consts/SpotsRef';
import CustomTag from '../Components/CustomTag/CustomTag';
import Button from '../Components/Button/Button';

const HomePage = () => {
  const [user] = useAuthState(auth);
  const { location, getLocation } = useGeolocation();
  const [data, setData] = useState<ISpot[]>();
  const [useGlobal, setUseGlobal] = useState(false);
  const [globalData, setGlobalData] = useState<ISpot[]>();
  const [filteredData, setFilteredData] = useState<ISpot[]>();
  const [isMapView, setIsMapView] = useState(false);
  const ref = query(
    spotsCollectionRef(db),
    where('userId', '==', user?.uid)
  ).withConverter(spotConverter);

  const [value, loading, error] = useCollectionData(ref);

  useEffect(() => {
    if (value) {
      setData(value);
      setFilteredData(value);
    }
  }, [value]);

  useEffect(() => {
    if (useGlobal) {
      getLocation();
    }
    if (!useGlobal) {
      setFilteredData(value);
    }
  }, [useGlobal]);

  useEffect(() => {
    const getSpots = async () => {
      const globalData = await spotsInRadius(
        [location.latitude, location.longitude],
        db
      ).catch((e) => console.log('e', e));
      setGlobalData(globalData as ISpot[]);
      setFilteredData(globalData as ISpot[]);
    };
    if (useGlobal && location.latitude) {
      getSpots();
    }
  }, [location]);

  const deleteHandler = async (ref: DocumentReference) => {
    if (ref) {
      await deleteDoc(ref).catch((e: Error) => console.error(e));
    }
  };

  const filterHandler = (filterList: string[]) => {
    const filteredData = filterByArray(data as ISpot[], filterList, 'tags');
    setFilteredData(filteredData);
  };

  const addTagHandler = async (tag: string) => {
    await setDoc(
      doc(db, 'users', user!.uid),
      {
        tags: arrayUnion(tag)
      },
      { merge: true }
    ).catch((error: Error) => console.error(error.message));
  };

  return (
    <>
      <Header auth={auth} />
      <Button variant='highlight'>
        <Link to={ADD}>Add Spot</Link>
      </Button>
      <div className='u-flex'>
        <CustomTag tagHandler={addTagHandler} />
        <TagFilter clickHandler={filterHandler} />
      </div>
      <div className='row'>
        <div className='form-ext-control'>
          <label className='form-ext-toggle__label'>
            <span>{isMapView ? `Map` : `List`} view</span>
            <div className='form-ext-toggle'>
              <input
                name='toggleCheckbox'
                type='checkbox'
                className='form-ext-input'
                onChange={() => setIsMapView(!isMapView)}
                checked={isMapView}
              />
              <div className='form-ext-toggle__toggler'>
                <i></i>
              </div>
            </div>
          </label>
        </div>
        <div className='form-ext-control'>
          <label className='form-ext-toggle__label'>
            <span>{useGlobal ? `Global` : `My`} spots</span>
            <div className='form-ext-toggle'>
              <input
                name='toggleCheckbox'
                type='checkbox'
                className='form-ext-input'
                onChange={() => setUseGlobal(!useGlobal)}
                checked={useGlobal}
              />
              <div className='form-ext-toggle__toggler'>
                <i></i>
              </div>
            </div>
          </label>
        </div>
      </div>
      {filteredData ? (
        isMapView ? (
          <MapView filteredData={filteredData} />
        ) : (
          <ListView filteredData={filteredData} deleteHandler={deleteHandler} />
        )
      ) : (
        <p>No data to display</p>
      )}
      {loading && <p>Loading data...</p>}
      {error && <p>{error.message}</p>}
      {!data && <p>You haven't added any spots yet.</p>}
      {useGlobal && !filteredData?.length && (
        <p>It seems there are no spots within 10km from your location.</p>
      )}
    </>
  );
};

export default HomePage;

// TODO edit global
// TODO toggles to another component
// TODO spot operations to a service?
