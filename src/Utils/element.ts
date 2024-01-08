export const getIndexToTrimTo = (
  container: HTMLElement,
  elementMargin: number = 0,
  negativeOffset: number = 0
) => {
  let currentWidth = 0;
  let indexToSlice = 0;
  const listItems = container.children;

  for (let i = 0; i < listItems.length; i++) {
    const listItemWidth =
      (listItems[i] as HTMLElement).offsetWidth + elementMargin;
    currentWidth += listItemWidth;

    if (currentWidth > container.offsetWidth - negativeOffset) {
      indexToSlice = i;
      break;
    }
  }

  return indexToSlice;
};
