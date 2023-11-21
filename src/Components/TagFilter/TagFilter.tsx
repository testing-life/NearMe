import React, { FC, useEffect, useState } from 'react';
import { Tags } from '../../Consts/Tags';
import TagButton from '../TagButton/TagButton';
import { doc } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import { auth, db } from '../../Firebase/Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

interface Props {
  clickHandler: (filterList: (typeof Tags)[]) => void;
}

const TagFilter: FC<Props> = ({ clickHandler }) => {
  const [filterList, setFilterList] = useState<(typeof Tags)[]>([]);
  const [user] = useAuthState(auth);
  const [value, loading, error] = useDocument(doc(db, 'users', user!.uid));

  useEffect(() => {
    clickHandler(filterList);
  }, [filterList]);

  useEffect(() => {
    console.log('value', value?.data()?.tags);
  }, [value]);

  const filterListHandler = (tag: typeof Tags) => {
    let newFilters = [];
    if (filterList.includes(tag)) {
      newFilters = filterList.filter((item) => item !== tag);
    } else {
      newFilters = [...filterList, tag];
    }
    setFilterList(newFilters);
  };

  return (
    <ul className='u-flex u-flex-wrap u-gap-1'>
      {Tags.map((tag: (typeof Tags)[number], index: number) => {
        return (
          <li key={`${tag}${index}`}>
            <TagButton
              //   TODO check typing
              isSelected={filterList.includes(tag as any)}
              remove={filterList.includes(tag as any)}
              tagLabel={tag}
              //   TODO check typing
              clickHandler={() => filterListHandler(tag as any)}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default TagFilter;
