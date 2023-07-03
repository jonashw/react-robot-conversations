import React from "react";

export const localStorageProperty = <T>(
  key: string,
  serialize: (value: T) => string,
  deserialize: (str: string) => T,
  defaultValue: T
) => ({
  get: () => {
    let item = localStorage.getItem(key);
    let value = item === null ? defaultValue : deserialize(item);
    return value;
  },
  set: (value: T) => localStorage.setItem(key, serialize(value)),
});

export function useLocalStorage<T>(
  key: string,
  serialize: (value: T) => string,
  deserialize: (str: string) => T,
  defaultValue: T
) {
  let storage = localStorageProperty(key, serialize, deserialize, defaultValue);
  let state = React.useState<T>(storage.get());
  React.useEffect(() => {
    storage.set(state[0]);
  }, [state[0]]);
  return state;
}
