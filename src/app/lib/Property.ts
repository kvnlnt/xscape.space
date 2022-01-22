export const useProperty = <T>(prop: T, callback?: (prop: T) => void): [() => T, (prop: T) => void] => {
  let property: T = prop;
  const getter = () => property;
  const setter = (prop: T) => {
    property = prop;
    if (callback) callback(property);
  };
  return [getter, setter];
};
