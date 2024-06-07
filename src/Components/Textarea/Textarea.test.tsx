import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChangeEvent } from 'react';

describe('Input component', () => {
  // it.skip('should render', () => {
  //   render(
  //     <Input
  //       id='email'
  //       required
  //       label='Email'
  //       type='email'
  //       placeholder='email'
  //       value=''
  //       onChange={() => jest.fn()}
  //     />
  //   );
  //   const label = screen.getByText('Email');
  //   const field = screen.getByPlaceholderText('email');
  //   expect(label).toBeInTheDocument();
  //   expect(field).toBeInTheDocument();
  //   expect((field as HTMLInputElement).value).toBe('');
  //   expect((field as HTMLInputElement).type).toBe('email');
  // });
  // it.skip('should be optional', () => {
  //   render(
  //     <Input
  //       id='email'
  //       label='Email'
  //       type='email'
  //       placeholder='email'
  //       value=''
  //       onChange={() => jest.fn()}
  //     />
  //   );
  //   const field = screen.getByPlaceholderText('email');
  //   expect((field as HTMLInputElement).required).toBeFalsy();
  // });
  // it.skip('should display error', () => {
  //   render(
  //     <Input
  //       id='email'
  //       label='Email'
  //       type='email'
  //       placeholder='email'
  //       value=''
  //       onChange={() => jest.fn()}
  //     />
  //   );
  //   const error = screen.getByText('I am an error');
  //   expect(error).toBeInTheDocument();
  // });
  // it.skip('should trigger handler on change', async () => {
  //   const changeHandler = jest.fn();
  //   render(
  //     <Input
  //       id='email'
  //       label='Email'
  //       type='email'
  //       placeholder='email'
  //       value=''
  //       onChange={changeHandler}
  //     />
  //   );
  //   const user = userEvent;
  //   const field = screen.getByPlaceholderText('email');
  //   await user.type(field, 'Test');
  //   expect(changeHandler).toHaveBeenCalled();
  // });
});
