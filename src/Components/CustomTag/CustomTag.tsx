import React, { FC, FormEvent, useState } from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import './CustomTag.css';
interface Props {
  tagHandler: (tag: string) => void;
}

const CustomTag: FC<Props> = ({ tagHandler }) => {
  const [tag, setTag] = useState('');

  const customTagHandler = (value: string) => setTag(value);

  const tagSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((e.target as any).tag.value) {
      tagHandler((e.target as any).tag.value);
    }
  };

  return (
    <form className='custom-tag' onSubmit={tagSubmitHandler}>
      <Input
        placeholder='Add a tag'
        id='customTag'
        label='Add a new custom tag'
        type='text'
        name='tag'
        value={tag}
        onChange={customTagHandler}
      />
      <Button type='submit'>Add</Button>
    </form>
  );
};

export default CustomTag;
