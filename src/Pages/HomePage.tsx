import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ADD } from '../Consts/Routes';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, db, spotConverter } from '../Firebase/Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { DocumentReference, collection, deleteDoc } from 'firebase/firestore';
import { ISpot } from '../Models/spot';
import Header from '../Components/Header/Header';
import './HomePage.css';
import TagFilter from '../Components/TagFilter/TagFilter';
import { Tags } from '../Consts/Tags';
import { filterByArray } from '../Utils/array';
import ListView from '../Components/ListView/ListView';
import MapView from '../Components/MapView/MapView';
import { spotsInRadius } from '../Utils/geo';
import useGeolocation from '../Hooks/useGeolocation';

const HomePage = () => {
  const [user] = useAuthState(auth);
  const { location, locationError, getLocation } = useGeolocation();
  const [data, setData] = useState<ISpot[]>();
  const [useGlobal, setUseGlobal] = useState(false);
  const [globalData, setGlobalData] = useState<ISpot[]>();
  const [filteredData, setFilteredData] = useState<ISpot[]>();
  const [isMapView, setIsMapView] = useState(false);
  const ref = collection(db, 'users', user!.uid, 'spots').withConverter(
    spotConverter
  );
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
    if (useGlobal && location.latitude && !locationError.code) {
      getSpots();
    }
  }, [location]);

  const deleteHandler = async (ref: DocumentReference) => {
    if (ref) {
      await deleteDoc(ref).catch((e: Error) => console.error(e));
    }
  };

  const filterHandler = (filterList: (typeof Tags)[]) => {
    const filteredData = filterByArray(data as ISpot[], filterList, 'tags');
    setFilteredData(filteredData);
  };

  return (
    <>
      <Header auth={auth} />
      <button className='bg-primary lg border-red-800'>
        <Link className='text-light' to={ADD}>
          Add Spot
        </Link>
      </button>
      <TagFilter clickHandler={filterHandler} />
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
    </>
  );
};

export default HomePage;

// by default load own spots in list view
// if in list view and toggle useGlobal, load global spots within radius - needs radius slider ?
// if in map view, load spot within radius

// load global spots within fixed radius of 10km - its supposed to be near me
// no slider needed to adjust the radius
