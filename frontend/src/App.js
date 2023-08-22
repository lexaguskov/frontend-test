import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Map } from './Map';

const domain = 'http://localhost:8000';

// TODO: local file cache
// TODO: mobile version
// TODO: store pins on server

export const App = () => {
  const [images, setImages] = useState([]);
  const [selection, setSelection] = useState(localStorage.getItem('selectedImage'));

  useEffect(() => {
    if (selection) localStorage.setItem('selectedImage', selection);
  }, [selection]);

  // todo force reload button
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

  return <Container>
    {images.map(f => (
      <Preview selected={f.file_stem === selection} onClick={() => setSelection(f.file_stem)}>
        <PreviewImage src={`${domain}/images/${f.file_stem}/preview`} />
      </Preview>
    ))}
    {images.length === 0 && <div>No images loaded</div>}
    {selection && images.find(a => a.file_stem === selection) && (
      <Map url={`${domain}/images/${selection}/2`} id={selection} />
    )}
  </Container>;
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

const Container = styled.div`
width: 100vw;
height: 100vh;
`;
