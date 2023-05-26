import React from "react";

function useLocalStorage<T>(
  key: string,
  serialize: (value: T) => string,
  deserialize: (str: string) => T,
  defaultValue: T
) {
  let item = localStorage.getItem(key);
  let value = item === null ? defaultValue : deserialize(item);
  let state = React.useState<T>(value);
  React.useEffect(() => {
    localStorage.setItem(key, serialize(state[0]));
  }, [state[0]]);
  return state;
}

export default useLocalStorage;
