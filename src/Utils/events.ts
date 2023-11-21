export const debounce = (mainFunction: () => void, delay: number = 3000) => {
  let timer: ReturnType<typeof setTimeout>;

  return function (...args: []) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      mainFunction(...args);
    }, delay);
  };
};
