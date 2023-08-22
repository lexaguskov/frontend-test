import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Map } from './Map';

const domain = 'http://localhost:8000';

// TODO: local file cache
// TODO: mobile version
// TODO: store pins on server
// TODO: store images in local cache

const pinDb = {};
const getPinsForImage = (img) => {
  return pinDb[img] || [];
}

const setPinsForImage = (img, pins) => {
  pinDb[img] = pins;
}

export const App = () => {
  const [images, setImages] = useState([]);
  const [selection, setSelection] = useState(localStorage.getItem('selectedImage'));

  const [pins, setPins] = useState([]);

  useEffect(() => {
    if (selection) localStorage.setItem('selectedImage', selection);
    setPins(getPinsForImage(selection));
  }, [selection]);

  const onAddPin = (pin) => {
    const value = [...pins, pin];
    setPins(value);
    setPinsForImage(selection, value);
  }

  const onDeletePin = (pin) => {
    const value = pins.filter(p => p !== pin);
    setPins(value);
    setPinsForImage(selection, value);
  }

  // TODO: force reload button
  useEffect(() => {
    const load = async () => {
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

  return <>
    {images.map(f => (
      <Preview selected={f.file_stem === selection} onClick={() => setSelection(f.file_stem)}>
        <PreviewImage src={`${domain}/images/${f.file_stem}/preview`} />
      </Preview>
    ))}
    {images.length === 0 && <div>No images loaded</div>}
    {selection && images.find(a => a.file_stem === selection) && (
      <Map url={`${domain}/images/${selection}/2`} id={selection} pins={pins} onAddPin={onAddPin} onDeletePin={onDeletePin} />
    )}
  </>;
};

const Preview = styled.button`
  background: ${f => f.selected ? 'lightgray' : 'none'};
  border: none;
  padding: 10px;
`;

const PreviewImage = styled.img`
width: 150px;
height: 100px;
`;