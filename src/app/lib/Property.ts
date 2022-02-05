export const useProperty = <T>(prop: T, callback?: (prop: T) => void): [() => T, (prop: T) => void] => {
  let property: T = prop;
  const getter = () => {
    return property;
  };
  const setter = (newProp: T) => {
    property = newProp;
    if (callback) callback(property);
  };
  return [getter, setter];
};
