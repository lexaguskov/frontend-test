import { useEffect, useState } from 'react';

const domain = 'http://localhost:8000';

// TODO: local file cache

export const App = () => {
  const [images, setImages] = useState([]);
  const [selection, setSelection] = useState(null);

  // todo force reload button
  useEffect(() => {
    const load = async () => {
      console.log('loading');
      try {
        const res = await fetch(domain + '/images');
        setImages(await res.json());
      } catch (e) {
        console.error('fail to load', e.toString());
        // TODO: show error message
      }
    }
    load();
  }, []);

  return <div>
    {images.map(f => (
      <div>
        <button style={{ background: f.file_stem === selection ? 'lightgray' : 'none', border: 'none' }} onClick={() => setSelection(f.file_stem)} >
          {f.file_stem}
        </button>
      </div>
    ))}
    {images.length === 0 && <div>nothing loaded</div>}
    {selection && images.find(a => a.file_stem === selection) && (
      <img src={`${domain}/images/${selection}`}></img>
    )}
  </div >;
};
