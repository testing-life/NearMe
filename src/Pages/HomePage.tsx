import React, { useEffect, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {
  auth,
  db,
  spotConverter,
  storage as customStorage
} from '../Firebase/Firebase';
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
import { ref, deleteObject, StorageReference } from 'firebase/storage';
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
import Select from '../Components/Select/Select';
import Spinner from '../Components/Spinner/Spinner';

export enum ViewMode {
  List = 'list',
  Map = 'map'
}

export enum DataType {
  Global = 'global',
  Local = 'local'
}

const HomePage = () => {
  const [user] = useAuthState(auth);
  const { location, getLocation } = useGeolocation();
  const [data, setData] = useState<ISpot[]>();
  const [globalData, setGlobalData] = useState<ISpot[]>();
  const [filteredData, setFilteredData] = useState<ISpot[]>();
  const [dataType, setDataType] = useState<DataType>(DataType.Local);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.List);
  const docRef = query(
    spotsCollectionRef(db),
    where('userId', '==', user?.uid)
  ).withConverter(spotConverter);

  const [value, loading, error] = useCollectionData(docRef);

  useEffect(() => {
    if (value) {
      setData(value);
      setFilteredData(value);
    }
  }, [value]);

  useEffect(() => {
    if (dataType === DataType.Global) {
      getLocation();
    }
    if (dataType === DataType.Local) {
      setFilteredData(value);
    }
  }, [dataType]);

  useEffect(() => {
    const getSpots = async () => {
      const globalData = await spotsInRadius(
        [location.latitude, location.longitude],
        db
      ).catch((e) => console.log('e', e));
      setGlobalData(globalData as ISpot[]);
      setFilteredData([
        ...(globalData as ISpot[]),
        ...(filteredData as ISpot[])
      ]);
    };
    if (dataType === DataType.Global && location.latitude) {
      getSpots();
    }
  }, [location]);

  const deleteHandler = async (
    docRef: DocumentReference,
    imageUrl: string = ''
  ) => {
    const imageRef = imageUrl ? ref(customStorage, imageUrl) : null;
    if (docRef) {
      await deleteDoc(docRef).catch((e: Error) => console.error(e));
      if (imageUrl) {
        deleteObject(imageRef as StorageReference)
          .then(() => console.log('Successfully deleted'))
          .catch((e: Error) => console.error(e));
      }
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

  const viewModeChange = (mode: ViewMode) => {
    if (mode) {
      setViewMode(mode);
    }
  };

  const dataTypeChange = (type: DataType) => {
    if (type) {
      setDataType(type);
    }
  };

  return (
    <>
      <Header auth={auth} />
      <div className='filter-container'>
        <CustomTag tagHandler={addTagHandler} />
        <TagFilter clickHandler={filterHandler} />
      </div>
      <div className='views-container row space-between'>
        <Select
          id='view-mode'
          options={[
            { label: 'List View', value: 'list' },
            { label: 'Map View', value: 'map' }
          ]}
          onChange={(val: string) => viewModeChange(val as ViewMode)}
        />
        <Select
          inverted
          id='data-mode'
          options={[
            { label: 'My spots', value: DataType.Local },
            { label: 'All spots', value: DataType.Global }
          ]}
          onChange={(val: string) => dataTypeChange(val as DataType)}
        />
      </div>
      {error && <p className='-is-error'>{error.message}</p>}
      {!loading && !data?.length && <p>You haven't added any spots yet.</p>}
      {dataType === DataType.Global && !filteredData?.length && (
        <p>It seems there are no spots within 10km from your location.</p>
      )}
      {!loading && filteredData ? (
        viewMode === ViewMode.Map ? (
          <MapView filteredData={filteredData} />
        ) : (
          <ListView filteredData={filteredData} deleteHandler={deleteHandler} />
        )
      ) : (
        <Spinner label='Loading spots' />
      )}
    </>
  );
};

export default HomePage;

// TODO edit global
// TODO spot operations to a service?
