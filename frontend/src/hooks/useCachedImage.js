import local from 'localforage';
import { useEffect, useState } from 'react';

export function useCachedImage(url) {
  const [blobUrl, setBlobUrl] = useState(null);
  useEffect(() => {
    const load = async () => {
      try {
        const item = await local.getItem(url);
        setBlobUrl(URL.createObjectURL(item));
        return;
      } catch (e) {
        console.log('file not in db', url);
      }

      try {
        const res = await fetch(url);
        const blob = await res.blob();
        console.log('file loaded', url);
        setBlobUrl(URL.createObjectURL(blob));

        await local.setItem(url, blob);
        console.log('file stored in db', url);
      } catch (e) {
        console.error('failed to fetch file', url);
        setBlobUrl(url); // fallback to original url
      }
    };
    load();
  }, [url]);
  return blobUrl;
  // FIXME: need a placeholder for case where nothing is loaded yet
}