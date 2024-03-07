export const debounce = <T extends any>(
  mainFunction: (arg?: any) => T,
  delay: number = 3000
) => {
  let timer: ReturnType<typeof setTimeout>;

  return function (...args: []) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      mainFunction(...args);
    }, delay);
  };
};
