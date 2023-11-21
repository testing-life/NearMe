import React, { ChangeEvent, FC, FormEvent, useState } from 'react';
import Input from '../Input/Input';

interface Props {
  tagHandler: (tag: string) => void;
}

const CustomTag: FC<Props> = ({ tagHandler }) => {
  const [tag, setTag] = useState('');

  const customTagHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setTag(e.target.value);

  const tagSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    tagHandler((e.target as any).tag.value);
  };

  return (
    <form onSubmit={tagSubmitHandler}>
      <Input
        placeholder='Add a tag'
        id='customTag'
        label='Add a tag'
        type='text'
        name='tag'
        value={tag}
        onChange={customTagHandler}
      />
      <button type='submit'>Add</button>
    </form>
  );
};

export default CustomTag;
