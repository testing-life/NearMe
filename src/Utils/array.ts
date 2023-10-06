export const filterByArray = <K, T>(
  data: K[],
  filters: T[],
  dataProperty: keyof K
) => {
  if (!filters.length) {
    return data;
  }
  return data.filter((obj) =>
    (obj[dataProperty] as T[]).some((item) => filters.includes(item))
  );
};
