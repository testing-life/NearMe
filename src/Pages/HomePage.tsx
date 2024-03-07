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
  Firestore,
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
import useGeolocation, { Ilocation } from '../Hooks/useGeolocation';
import { spotsCollectionRef } from '../Consts/SpotsRef';
import CustomTag from '../Components/CustomTag/CustomTag';
import Select from '../Components/Select/Select';
import Spinner from '../Components/Spinner/Spinner';
import { debounce } from '../Utils/events';
import { User } from 'firebase/auth';

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
  const [pristineData, setPristineData] = useState<ISpot[]>();
  const [globalData, setGlobalData] = useState<ISpot[]>();
  const [filteredData, setFilteredData] = useState<ISpot[]>();
  const [dataType, setDataType] = useState<DataType>(DataType.Local);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.List);
  const [filterList, setFilterList] = useState<string[]>([]);
  const docRef = query(
    spotsCollectionRef(db),
    where('userId', '==', user?.uid)
  ).withConverter(spotConverter);

  const [value, loading, error] = useCollectionData(docRef);

  useEffect(() => {
    if (!location.latitude && !location.longitude) {
      getLocation();
    }
  }, [location, getLocation]);

  //  first load, list view, my spots
  useEffect(() => {
    if (!error && !loading && value) {
      // setPristineData(value);
      setFilteredData(value);
    }
  }, [value, error, loading]);

  useEffect(() => {
    if (dataType === DataType.Local) {
      if (viewMode === ViewMode.List) {
        // set all mine
        // setPristineData(value);
        setFilteredData(value);
      }
      if (viewMode === ViewMode.Map) {
        // set all mine in radius
        getSpotsInRadius(location, db, 25000, user).then((res) => {
          if (res) {
            if (filterList.length) {
              const filteredData = filterByArray(
                res as ISpot[],
                filterList,
                'tags'
              );
              setFilteredData(filteredData);
            } else {
              setFilteredData(res);
            }
          }
        });
      }
    }
    if (dataType === DataType.Global) {
      if (viewMode === ViewMode.List) {
        // set all other in radius
        console.log('global,list');
        getSpotsInRadius(location, db, 25000).then((res) => {
          if (res) {
            if (filterList.length) {
              const filteredData = filterByArray(
                res as ISpot[],
                filterList,
                'tags'
              );
              setFilteredData(filteredData);
            } else {
              setFilteredData(res);
            }
          }
        });
      }
      if (viewMode === ViewMode.Map) {
        // set all other in radius
        console.log('global,map');
        getSpotsInRadius(location, db, 25000).then((res) => {
          if (res) {
            if (filterList.length) {
              const filteredData = filterByArray(
                res as ISpot[],
                filterList,
                'tags'
              );
              setFilteredData(filteredData);
            } else {
              setFilteredData(res);
            }
          }
        });
      }
    }
  }, [dataType, viewMode, value, location, filterList, user]);

  const getSpotsInRadius = async (
    location: Ilocation,
    db: Firestore,
    radiusInM: number,
    user: User | null = null
  ) => {
    return await spotsInRadius(
      [location.latitude, location.longitude],
      db,
      radiusInM,
      user as User
    ).catch((e) => console.log('e', e));
  };

  useEffect(() => {
    if (filterList.length) {
      const filteredData = filterByArray(value as ISpot[], filterList, 'tags');
      setFilteredData(filteredData);
    }
  }, [filterList]);

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
    setFilterList(filterList);
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
            { label: "Others' spots", value: DataType.Global }
          ]}
          onChange={(val: string) => dataTypeChange(val as DataType)}
        />
      </div>
      {error && <p className='-is-error'>{error.message}</p>}
      {dataType === DataType.Global && globalData && !globalData?.length ? (
        <p className='-space-bottom'>
          It seems there are no spots from others around you (within 10km)
        </p>
      ) : null}
      {!loading && !value?.length && <p>You haven't added any spots yet.</p>}
      {dataType === DataType.Global && !filteredData?.length && (
        <p>It seems there are no spots within 25km from your location.</p>
      )}
      {filteredData ? (
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

//                           list view               map view
// # my spots                load all                load all within 25km radius

// # others spots            load all within         load all within 25km radius
// #                         25km radius
// #                         dont mix with mine

// 1. load
// 2. if filters, then filter
// 3. set as filtered
