import { useState, useEffect } from "react";

export const useSessionStorage = <T>(key: string, defaultValue: T): [T, React.Dispatch<T>] => {
  const [value, setValue] = useState(() => {
    if (window) {
      const savedValue = sessionStorage.getItem(key);
      const initial = savedValue ? JSON.parse(savedValue) : defaultValue;
      return initial;
    }
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
