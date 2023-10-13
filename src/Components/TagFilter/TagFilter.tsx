import React, { FC, useEffect, useState } from "react";
import { Tags } from "../../Consts/Tags";
import TagButton from "../TagButton/TagButton";

interface Props {
  clickHandler: (filterList: (typeof Tags)[]) => void;
}

const TagFilter: FC<Props> = ({ clickHandler }) => {
  const [filterList, setFilterList] = useState<(typeof Tags)[]>([]);

  useEffect(() => {
    clickHandler(filterList);
  }, [filterList]);

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
    <ul className="u-flex u-flex-wrap u-gap-1">
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
