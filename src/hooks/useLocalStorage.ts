import React, { useState, useEffect } from "react";

export const useLocalStorage = <T>(key: string, defaultValue: T): [T, React.Dispatch<T>] => {
  const [value, setValue] = useState(() => {
    if (window) {
      const savedValue = localStorage.getItem(key);
      const initial = savedValue ? JSON.parse(savedValue) : defaultValue;
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
