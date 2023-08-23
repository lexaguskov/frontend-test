import local from "localforage";
import { useEffect, useState } from "react";

export function usePersistedState(name, initial) {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    local.getItem(name).then((val) => val !== null && setValue(val));
  }, [name]);

  useEffect(() => {
    local.setItem(name, value);
  }, [value, name]);

  return [value, setValue];
}
