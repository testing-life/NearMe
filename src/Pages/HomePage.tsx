import React, { useEffect, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {
  auth,
  db,
  spotConverter,
  storage as customStorage,
} from '../Firebase/Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  DocumentReference,
  Firestore,
  deleteDoc,
  query,
  where,
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
import Select from '../Components/Select/Select';
import Spinner from '../Components/Spinner/Spinner';
import { User } from 'firebase/auth';

export enum ViewMode {
  List = 'list',
  Map = 'map',
}

export enum DataType {
  Global = 'global',
  Local = 'local',
}

const HomePage = () => {
  const [user] = useAuthState(auth);
  const { location, getLocation } = useGeolocation();
  const [filteredData, setFilteredData] = useState<ISpot[]>();
  const [localLoading, setLocalLoading] = useState(false);
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

  useEffect(() => {
    if (!error && !loading && value) {
      setFilteredData(value);
    }
  }, [value, error, loading]);

  useEffect(() => {
    if (dataType === DataType.Local) {
      if (viewMode === ViewMode.List) {
        setFilteredData(value);
      }
      if (viewMode === ViewMode.Map) {
        setLocalLoading(true);
        getSpotsInRadius(location, db, 25000, user)
          .then((res) => {
            if (res) {
              const onlyMine = res.filter(
                (item: ISpot) => item.userId === user?.uid
              );
              if (filterList.length) {
                const filteredData = filterByArray(
                  onlyMine as ISpot[],
                  filterList,
                  'tags'
                );
                setFilteredData(filteredData);
              } else {
                setFilteredData(onlyMine);
              }
            }
          })
          .finally(() => setLocalLoading(false));
      }
    }
    if (dataType === DataType.Global) {
      setLocalLoading(true);
      getSpotsInRadius(location, db, 25000)
        .then((res) => {
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
        })
        .finally(() => setLocalLoading(false));
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
  }, [filterList, value]);

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
      <div className='mb-12'>
        <Header auth={auth} />
      </div>
      <div className='filter-container'>
        <h2 className='mb-12'>Filter spots:</h2>
        <TagFilter clickHandler={filterHandler} />
      </div>
      <div className='views-container row space-between'>
        <Select
          id='view-mode'
          options={[
            { label: 'List View', value: 'list' },
            { label: 'Map View', value: 'map' },
          ]}
          onChange={(val: string) => viewModeChange(val as ViewMode)}
        />
        <Select
          inverted
          id='data-mode'
          options={[
            { label: 'Only Mine', value: DataType.Local },
            { label: "With Others'", value: DataType.Global },
          ]}
          onChange={(val: string) => dataTypeChange(val as DataType)}
        />
      </div>
      {error && <p className='-is-error'>{error.message}</p>}
      {dataType === DataType.Global && !filteredData?.length ? (
        <p className='-space-bottom'>
          It seems there are no spots from others around you (within 25km)
        </p>
      ) : null}
      {!loading && !value?.length && <p>You haven't added any spots yet.</p>}
      {filteredData ? (
        viewMode === ViewMode.Map ? (
          <div className='map-spinner-container'>
            {localLoading ? (
              <div className='map-spinner'>
                <Spinner label='Updating spots' />
              </div>
            ) : null}
            <MapView filteredData={filteredData} dataType={dataType} />
          </div>
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
