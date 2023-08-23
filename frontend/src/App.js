import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Map } from './Map';
import { addPin, deletePin, domain, listImages, listPins } from './api';

const cache = {
  db: {},
  getPinsForImage(img) {
    return this.db[img] || [];
  },
  setPinsForImage(img, pins) {
    this.db[img] = pins;
  },
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
      pin.id = res;
      cache.setPinsForImage(selection, value);
    }
    // TODO: rollback in case of error
  }

  const onDeletePin = async (pin) => {
    if (!pin.id) return;
    const value = pins.filter(p => p !== pin);
    setPins(value); // performing optimistic update
    const res = await deletePin(selection, pin.id);
    if (res) {
      cache.setPinsForImage(selection, value);
    }
    // TODO: rollback in case of error
  }

  // load list of pins when selecting an image
  // NOTE: using useEffect here because we also want it to fire when the page is loaded
  useEffect(() => {
    const load = async () => {
      localStorage.setItem('selectedImage', selection);
      setPins(cache.getPinsForImage(selection)); // load from cache first
      const pins = await listPins(selection);
      if (pins !== null) {
        cache.setPinsForImage(selection, pins);
        setPins(pins);
      }
    }
    if (selection) load();
  }, [selection]);

  // load list of images when mounted 
  useEffect(() => {
    const load = async () => {
      const images = await listImages();
      if (images !== null) setImages(images);
      if (images.length) {
        setSelection(selection => selection || images[0].file_stem); // select 1st image if nothing is selected
      }
    }
    load();
  }, [setImages]);

  return <>
    <ImageList>
      {images.map(f => (
        <Preview key={f.file_stem} selected={f.file_stem === selection} onClick={() => setSelection(f.file_stem)}>
          <PreviewImage src={`${domain}/images/${f.file_stem}/preview`} />
        </Preview>
      ))}
    </ImageList>
    {images.length === 0 && <div>No images</div>}
    {selection && images.find(a => a.file_stem === selection) && (
      <Map url={`${domain}/images/${selection}`} id={selection} pins={pins} onAddPin={onAddPin} onDeletePin={onDeletePin} />
    )}
  </>;
};

const ImageList = styled.div`
  display: flex;
  overflow-x: scroll;
`;

const Preview = styled.button`
  background: ${f => f.selected ? 'lightgray' : 'none'};
  border: none;
  padding: 10px;
`;

const PreviewImage = styled.img`
width: 150px;
height: 100px;
`;