import { MutableRefObject, useRef } from 'react';

export const useRefState = <T>(
  initialValue: T
): [MutableRefObject<T>, (arg0: T) => void] => {
  const value = useRef<T>(initialValue);

  const setValue = (newValue: T) => {
    value.current = newValue;
  };

  return [value, setValue];
};
