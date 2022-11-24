import React, { FC } from "react";
import { Tags } from "../../Consts/Tags";
import "./TagButton.css";

interface Props {
  remove?: boolean;
  tagLabel: typeof Tags[number];
  clickHandler: () => void;
  isSelected?: boolean;
}

const TagButton: FC<Props> = ({
  remove,
  tagLabel,
  clickHandler,
  isSelected = false,
}) => {
  return (
    <button
      type="button"
      className={`tag ${isSelected ? "is-selected" : ""} ${
        remove ? "is-remove" : "is-add"
      }  border-yellow-500 bg-yellow-400`}
      onClick={clickHandler}
    >
      {tagLabel}
      <span
        className={`tag tag__delete ${
          isSelected ? "bg-red-800" : "bg-green-700"
        }`}
      ></span>
    </button>
  );
};

export default TagButton;
