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
  const [pins, setPins] = useState([]);
  const [activePin, setActivePin] = useState(null);

  const onPin = (e, j, k) => {
    const { offsetX, offsetY } = j;
    // console.log(e.instance, j.offsetX, j.offsetY);
    //const { layerX, layerY } = j;
    // console.log(layerX, layerY);
    setPins(p => [...p, { x: offsetX, y: offsetY }]);
  }

  console.log('p', pins);

  return (
    <TransformWrapper
      style={{ width: "100vw" }}
      initialScale={0.1}
      minScale={0.1}
      centerOnInit={true}
      onPanningStart={onPin}
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
            {pins.filter(p => p !== activePin).map((p) =>
              <Pin key={`${p.x}.${p.y}`} x={p.x} y={p.y} onClick={() => setActivePin(p)} />
            )}
            {activePin && <Pin x={activePin.x} y={activePin.y} active />}
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  )
}

const Pin = styled.button`
  position: absolute;
  font-size: 10rem;
  color: ${p => p.active ? "red" : "blue"};
  left: ${p => p.x}px;
  top: ${p => p.y}px;
  margin-left: -5rem;
  margin-top: -8rem;
  &:after {
    content: "●";
  }
`;
