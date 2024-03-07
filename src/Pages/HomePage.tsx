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
import { debounce } from '../Utils/events';

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
  const [filterList, setFilterList] = useState<string[]>([]);
  // const docRef = query(
  //   spotsCollectionRef(db),
  //   where('userId', '==', user?.uid)
  // ).withConverter(spotConverter);

  // const [value, loading, error] = useCollectionData(docRef);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  useEffect(() => {
    const getMySpotsInRadius = async () => {
      const myData = await spotsInRadius(
        [location.latitude, location.longitude],
        db,
        1000
      ).catch((e) => console.log('e', e));
      if (myData) {
        setData(myData);
        setFilteredData(myData);
      }
    };
    if (location.latitude && location.longitude && !data) {
      getMySpotsInRadius();
    }
  }, [location]);

  useEffect(() => {
    if (dataType === DataType.Global) {
      getLocation();
    }
    if (dataType === DataType.Local) {
      setFilteredData(data);
      setGlobalData(undefined);
    }
  }, [dataType]);

  useEffect(() => {
    const getSpots = async () => {
      const globalDataRes = await spotsInRadius(
        [location.latitude, location.longitude],
        db
      ).catch((e) => console.log('e', e));
      const toRemovedMine = globalDataRes?.filter(
        (doc: ISpot) => doc.userId !== user?.uid
      );
      setGlobalData(toRemovedMine as ISpot[]);
      console.log('toRemovedMine', filteredData, toRemovedMine);
      const combinedSpots = [
        ...(toRemovedMine as ISpot[]),
        ...(filteredData as ISpot[])
      ];
      setFilteredData(combinedSpots);
      console.log('combinedSpots', combinedSpots);
    };
    if (dataType === DataType.Global && location.latitude) {
      getSpots();
    }
  }, [location]);

  useEffect(() => {
    if (filterList.length && data?.length) {
      const filteredData = filterByArray(data as ISpot[], filterList, 'tags');
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

  const radiusHandler = debounce<Promise<void>>(async (radiusInM: number) => {
    spotsInRadius([location.latitude, location.longitude], db, radiusInM)
      .then((res) => {
        console.log('res', res);
        if (filterList.length && data?.length) {
          const filteredData = filterByArray(
            res as ISpot[],
            filterList,
            'tags'
          );
          setFilteredData(filteredData);
        } else {
          setFilteredData(res as ISpot[]);
        }
      })
      .catch((e) => console.log('e', e));

    console.log('filterList', filteredData, data);
  }, 1000);

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
      {/* {error && <p className='-is-error'>{error.message}</p>} */}
      {dataType === DataType.Global && globalData && !globalData?.length ? (
        <p className='-space-bottom'>
          It seems there are no spots from others around you (within 10km)
        </p>
      ) : null}
      {/* {!loading && !data?.length && <p>You haven't added any spots yet.</p>} */}
      {dataType === DataType.Global && !filteredData?.length && (
        <p>It seems there are no spots within 10km from your location.</p>
      )}
      {filteredData ? (
        viewMode === ViewMode.Map ? (
          <MapView filteredData={filteredData} radiusHandler={radiusHandler} />
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
