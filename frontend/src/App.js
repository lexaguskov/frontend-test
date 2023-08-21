import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { MiniMap, TransformWrapper, TransformComponent, useTransformInit } from "react-zoom-pan-pinch";


const domain = 'http://localhost:8000';

// TODO: local file cache
// TODO: mobile version
// TODO: loading progress bar
// TODO: save selection

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

  return <div style={{ width: '100vw', height: '100vh' }}>
    {images.map(f => (
      <div>
        <Preview selected={f.file_stem === selection} onClick={() => setSelection(f.file_stem)}>
          {f.file_stem}
        </Preview>
      </div>
    ))}
    {images.length === 0 && <div>nothing loaded</div>}
    {selection && images.find(a => a.file_stem === selection) && (
      <Image url={`${domain}/images/${selection}`} />
    )}
  </div >;
};

const Preview = styled.button`
  background: ${f => f.selected ? 'lightgray' : 'none'};
  border: none;
`;

// TODO: calculate initial scale
const Image = ({ url }) => {

  const [pinX, setPinX] = useState(-1);
  const [pinY, setPinY] = useState(-1);

  const onPin = (e) => {
    const { layerX, layerY } = e.nativeEvent;
    console.log(layerX, layerY);
    setPinX(layerX);
    setPinY(layerY);
  }

  return (
    <TransformWrapper
      style={{ width: "100vw" }}
      initialScale={0.1}
      minScale={0.1}
      centerOnInit={true}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <div style={{ width: '100vw', height: '100vh' }}>
          <div className="tools">
            <button onClick={() => zoomIn()}>+</button>
            <button onClick={() => zoomOut()}>-</button>
            <button onClick={() => resetTransform()}>x</button>
            <div
              style={{
                position: "fixed",
                zIndex: 5,
                top: "50px",
                right: "50px",
              }}
            >
              <MiniMap width={200}>{<img src={url} alt="test" />}</MiniMap>
            </div>
          </div>
          <TransformComponent
            wrapperStyle={{ maxWidth: "100%", maxHeight: "calc(100vh - 100px)" }}
          >
            <img src={url} alt="test" />
            <button
              style={{ position: 'absolute', width: '100%', height: '100%', background: 'none', border: 'none' }}
              onClick={onPin}
            >
              Click me!
            </button>
            <div style={{ position: 'absolute', fontSize: '10rem', color: 'red', left: pinX, top: pinY }}>
              ●
            </div>
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  )
} 
