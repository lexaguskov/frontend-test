import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { MiniMap, TransformWrapper, TransformComponent, useTransformInit } from "react-zoom-pan-pinch";


const domain = 'http://localhost:8000';

// TODO: local file cache
// TODO: mobile version
// TODO: loading progress bar
// TODO: save selection
// FIXME: initial zoom factor

// == PINS ==
// FIXME: pin should not scale
// FIXME: pins prevent double click
// TODO: delete pins
// TODO: store pins per image
// TODO: add comment for a pin
// TODO: pin should not appear when panning

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
  const [newPin, setNewPin] = useState(null);

  const panInfo = useRef({ x: 0, y: 0 });

  const onPanningStart = (e, j) => {
    panInfo.current = { x: j.offsetX, y: j.offsetY };
  }
  const onPin = (e, j) => {
    console.log(e, j);
    if (j.target.tagName === "BUTTON") return;
    const { offsetX, offsetY } = j;
    // console.log(e.instance, j.offsetX, j.offsetY);
    //const { layerX, layerY } = j;
    // console.log(layerX, layerY);
    const dx = offsetX - panInfo.current.x;
    const dy = offsetY - panInfo.current.y;

    if (dx === 0 && dy === 0) {
      const newPin = { x: offsetX, y: offsetY }
      // setPins(p => [...p, newPin]);
      setNewPin(newPin);
      setActivePin(null);
    }
  }

  const deleteActivePin = () => {
    setPins(p => p.filter(pin => pin !== activePin));
    setActivePin(null);
  }

  const addNewPin = () => {
    setPins(p => [...p, newPin]);
    // setActivePin(newPin);
    setNewPin(null);
  }

  console.log('p', pins);

  return (
    <TransformWrapper
      style={{ width: "100vw" }}
      initialScale={0.2}
      minScale={0.1}
      centerOnInit={true}
      onPanningStop={onPin}
      onPanningStart={onPanningStart}
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
            {pins.filter(p => p !== activePin && p !== newPin).map((p) =>
              <Pin key={`${p.x}.${p.y}`} x={p.x} y={p.y} onClick={() => setActivePin(p)}>
                {/* <button style={{ fontSize: '10rem', borderRadius: '5rem', position: 'absolute', top: '0rem', left: '10rem', padding: '0 2rem' }}>
                  Create
                </button> */}
              </Pin>
            )}
            {activePin && <Pin x={activePin.x} y={activePin.y} active>
              <button style={{ color: 'red', cursor: 'pointer', fontSize: '10rem', borderRadius: '5rem', position: 'absolute', top: '0rem', left: '10rem', padding: '0 2rem' }} onClick={deleteActivePin}>
                X&nbsp;Delete
              </button>
            </Pin>}
            {newPin && <Pin x={newPin.x} y={newPin.y}>
              <button style={{ color: 'blue', cursor: 'pointer', fontSize: '10rem', borderRadius: '5rem', position: 'absolute', top: '0rem', left: '10rem', padding: '0 2rem' }} onClick={addNewPin}>
                +&nbsp;Add
              </button>
            </Pin>}

          </TransformComponent>
        </div>
      )}
    </TransformWrapper >
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
  cursor: pointer;
  background: none;
  border: none;
  &:after {
    content: "●";
  }
  text-shadow: -.3rem -.3rem 0 white, .3rem -.3rem 0 white, -.3rem .3rem 0 white, .3rem .3rem 0 white;
`;
