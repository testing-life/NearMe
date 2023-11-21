import React, { FC, useEffect, useState } from 'react';
import { Tags } from '../../Consts/Tags';
import TagButton from '../TagButton/TagButton';
import { doc } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import { auth, db } from '../../Firebase/Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import useTagsStore from '../../Stores/tagsStore';

interface Props {
  clickHandler: (filterList: string[]) => void;
}

const TagFilter: FC<Props> = ({ clickHandler }) => {
  const [filterList, setFilterList] = useState<string[]>([]);
  const [user] = useAuthState(auth);
  const [customTags, loading, error] = useDocument(doc(db, 'users', user!.uid));
  const tags = useTagsStore((state) => state.tags);
  const updateTags = useTagsStore((state) => state.updateTags);

  useEffect(() => {
    clickHandler(filterList);
  }, [filterList]);

  useEffect(() => {
    const newTags: string[] = customTags?.data()?.tags;
    if (newTags?.length) {
      updateTags([...newTags, ...Tags]);
    }
  }, [customTags]);

  const filterListHandler = (tag: (typeof tags)[number]) => {
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
      {loading && <p>Loading tags...</p>}
      {error && <p>Couldn't load tags. {error.message}</p>}
      {tags.map((tag: (typeof tags)[number], index: number) => {
        return (
          <li key={`${tag}${index}`}>
            <TagButton
              isSelected={filterList.includes(tag)}
              remove={filterList.includes(tag)}
              tagLabel={tag}
              clickHandler={() => filterListHandler(tag)}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default TagFilter;
