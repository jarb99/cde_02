import { useEffect, useState } from "react";

const useDebounce = <T>(value: T, delay: number): [T, (value: T) => void] => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(
    () => {
      if (value !== debouncedValue) {
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);

        return () => {
          clearTimeout(handler);
        };
      }
    },
    [value, delay, debouncedValue]
  );

  return [debouncedValue, setDebouncedValue];
};

export default useDebounce;