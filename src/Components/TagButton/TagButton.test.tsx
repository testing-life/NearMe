import { render, fireEvent, screen } from '@testing-library/react';
import TagButton from './TagButton';
import { Tags } from './../../Consts/Tags'; // assuming Tags is imported or defined somewhere

describe('TagButton', () => {
  const clickHandlerMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct parameters', () => {
    const tagLabel = 'Test Tag';
    render(<TagButton tagLabel={tagLabel} clickHandler={clickHandlerMock} />);
    expect(screen.getByText(tagLabel)).toBeInTheDocument();
  });

  it('renders with correct icon when isSelected is true', () => {
    const tagLabel = 'Test Tag';
    render(
      <TagButton
        tagLabel={tagLabel}
        clickHandler={clickHandlerMock}
        isSelected={true}
      />
    );
    expect(screen.getByTestId('tick-icon')).toBeInTheDocument();
  });

  it('renders with correct icon when isSelected is false', () => {
    const tagLabel = 'Test Tag';
    render(
      <TagButton
        tagLabel={tagLabel}
        clickHandler={clickHandlerMock}
        isSelected={false}
      />
    );
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
  });

  it('renders with remove class when remove prop is true', () => {
    const tagLabel = 'Test Tag';
    render(
      <TagButton
        tagLabel={tagLabel}
        clickHandler={clickHandlerMock}
        remove={true}
      />
    );

    expect(screen.getByText('Test Tag')).toHaveClass('tag -is-remove');
  });

  it('renders with add class when remove prop is false or missing', () => {
    const tagLabel = 'Test Tag';
    render(<TagButton tagLabel={tagLabel} clickHandler={clickHandlerMock} />);
    expect(screen.getByText('Test Tag')).toHaveClass('tag -is-add');
  });

  it('calls clickHandler when clicked', () => {
    const tagLabel = 'Test Tag';
    render(<TagButton tagLabel={tagLabel} clickHandler={clickHandlerMock} />);
    fireEvent.click(screen.getByText(tagLabel));
    expect(clickHandlerMock).toHaveBeenCalledTimes(1);
  });
});
