import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

const HomePage = () => {
  const [user] = useAuthState(auth);
  const [data, setData] = useState<ISpot[]>();
  const [useGlobal, setUseGlobal] = useState(false);
  const [filteredData, setFilteredData] = useState<ISpot[]>();
  const [isMapView, setIsMapView] = useState(false);
  const ref = collection(db, 'users', user!.uid, 'spots').withConverter(
    spotConverter
  );
  const globalRef = collection(db, 'spots').withConverter(spotConverter);
  const [value, loading, error] = useCollectionData(ref);
  const [globalValue, globalLoading, globalError] =
    useCollectionData(globalRef);

  useEffect(() => {
    if (value) {
      if (useGlobal && globalValue) {
        setData(globalValue);
        setFilteredData(globalValue);
      } else {
        setData(value);
        setFilteredData(value);
      }
    }
  }, [value, useGlobal, globalValue]);

  const deleteHandler = async (ref: DocumentReference) => {
    if (ref) {
      await deleteDoc(ref).catch((e: Error) => console.error(e));
    }
  };

  const filterHandler = (filterList: (typeof Tags)[]) => {
    const rawData = useGlobal ? globalValue : data;
    const filteredData = filterByArray(rawData as ISpot[], filterList, 'tags');
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
            <span>{isMapView ? `Global` : `My`} spots</span>
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
