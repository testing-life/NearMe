import React, { FC, useEffect, useRef, useState } from "react";
import Pill from "../Pill/Pill";
import "./PillsList.css";
import { getIndexToTrimTo } from "../../Utils/element";

interface Props {
  labels: string[];
}

const PillsList: FC<Props> = ({ labels }) => {
  const pillsRef = useRef(null);
  const [isOverflown, setIsOverflown] = useState(false);
  const [data, setData] = useState(labels);
  const getOverflow = (element: HTMLElement) =>
    element.scrollWidth > document.documentElement.offsetWidth;

  useEffect(() => {
    if (pillsRef.current && (pillsRef.current as HTMLElement).children.length) {
      const needsTrimming = getOverflow(pillsRef.current);
      if (needsTrimming) {
        setIsOverflown(getOverflow(pillsRef.current));
        setData(labels.slice(0, getIndexToTrimTo(pillsRef.current, 10, 50)));
      }
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (
        pillsRef.current &&
        (pillsRef.current as HTMLElement).children.length
      ) {
        const needsTrimming = getOverflow(pillsRef.current);
        if (needsTrimming) {
          setIsOverflown(getOverflow(pillsRef.current));
          setData(labels.slice(0, getIndexToTrimTo(pillsRef.current, 10, 50)));
        }
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ul ref={pillsRef} className={`pills-list `}>
      {data?.map((label: string, index: number) => (
        <li className="pills-list__item" key={`${label}${index}`}>
          <Pill label={label} />
        </li>
      ))}
      {isOverflown ? (
        <li className="pills-list__item">
          <Pill label={`+${labels.length - data.length}`} />
        </li>
      ) : null}
    </ul>
  );
};

export default PillsList;
