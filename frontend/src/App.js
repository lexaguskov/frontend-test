import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Map } from './Map';
import { addPin, deletePin, domain, listImages, listPins } from './api';

// TODO: mobile version
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

  const onAddPin = async (pin) => {
    const value = [...pins, pin];
    setPins(value); // performing optimistic update
    const res = await addPin(selection, pin);
    if (res) {
      setPinsForImage(selection, value);
    }
    // TODO: rollback in case of error
  }

  const onDeletePin = async (pin) => {
    const value = pins.filter(p => p !== pin);
    setPins(value); // performing optimistic update
    const res = await deletePin(selection, pin.id);
    if (res) {
      setPinsForImage(selection, value);
    }
    // TODO: rollback in case of error
  }

  // NOTE: using useEffect because we also want it to fire when the page is loaded
  useEffect(() => {
    const load = async () => {
      localStorage.setItem('selectedImage', selection);
      setPins(getPinsForImage(selection)); // load from cache first
      const pins = await listPins(selection);
      if (pins !== null) {
        setPinsForImage(pins);
        setPins(pins);
      }
    }
    if (selection) load();
  }, [selection]);

  useEffect(() => {
    const load = async () => {
      const images = await listImages();
      if (images !== null) setImages(images)
    }
    load();
  }, [setImages]);

  return <>
    <div>
      {images.map(f => (
        <Preview selected={f.file_stem === selection} onClick={() => setSelection(f.file_stem)}>
          <PreviewImage src={`${domain}/images/${f.file_stem}/preview`} />
        </Preview>
      ))}
    </div>
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