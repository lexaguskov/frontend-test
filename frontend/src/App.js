import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { MiniMap, TransformWrapper, TransformComponent, useTransformInit } from "react-zoom-pan-pinch";
import { fetchAndSaveToCache, getCached } from './localCache';


const domain = 'http://localhost:8000';

// TODO: local file cache
// TODO: mobile version
// TODO: loading progress bar
// TODO: save selection
// FIXME: initial zoom factor

// == PINS ==
// FIXME: pin should not scale
// FIXME: pins prevent double click
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

  // useEffect(() => {
  //   fetchAndSaveToCache(domain + '/images/' + selection + "/3", selection).then(url => console.log('cached', url))
  // }, [selection]);

  return <div style={{ width: '100vw', height: '100vh' }}>
    {images.map(f => (
      <Preview selected={f.file_stem === selection} onClick={() => setSelection(f.file_stem)}>
        <img src={`${domain}/images/${f.file_stem}/preview`} width="150" height="100" />
      </Preview>
    ))}
    {images.length === 0 && <div>nothing loaded</div>}
    {selection && images.find(a => a.file_stem === selection) && (
      <Image url={`${domain}/images/${selection}/2`} />
    )}
  </div >;
};

// TODO: calculate initial scale
const Image = ({ url, onUpdateMap }) => {
  const [pins, setPins] = useState([]);
  const [activePin, setActivePin] = useState(null);
  const [newPin, setNewPin] = useState(null);

  const panInfo = useRef({ x: 0, y: 0 });

  const onPanningStart = (e, j) => {
    panInfo.current = { x: j.offsetX, y: j.offsetY };
  }
  const onPin = (e, j) => {
    // console.log(e, j);
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

  // console.log('p', pins);

  // const [mapPos, setMapPos] = useState({ x: 0, y: 0 });

  const [pinScale, setPinScale] = useState(0);
  const onPan = (e) => {
    setPinScale(0.2 * 1 / e.state.scale);
    //   const x = 0.5 * e.state.positionX / e.instance.bounds.minPositionX;
    //   const y = 0.5 * e.state.positionY / e.instance.bounds.minPositionY;
    //   setMapPos({ x, y });

    //   console.log(e.state.positionX / e.state.scale, e.instance.bounds.minPositionX / e.state.scale);


    //   //console.log(e.bounds.minPositionX * 1 / scale, e.bounds.minPositionY * 1 / scale);
  }

  return (
    <TransformWrapper
      style={{ width: "100vw" }}
      initialScale={0.2}
      minScale={0.1}
      centerOnInit={true}
      onPanningStop={onPin}
      onPanningStart={onPanningStart}
      onTransformed={onPan}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <div style={{ width: '100vw', height: '100vh' }}>
          {/* {console.log('rrrr', rest.instance.transformState.scale)} */}
          <TransformComponent
            wrapperStyle={{ maxWidth: "100%", maxHeight: "calc(100vh - 100px)" }}
          >
            <img src={url} alt="test" />
            {pins.filter(p => p !== activePin && p !== newPin).map((p) =>
              <Pin scale={pinScale} key={`${p.x}.${p.y}`} x={p.x} y={p.y} onClick={() => setActivePin(p)}>
                {<div style={{ textWrap: 'nowrap', fontSize: '6rem', borderRadius: '5rem', position: 'absolute', margin: '-.6em 0 0 100px' }}>
                  Some text
                </div>}
              </Pin>
            )}
            {activePin && <Pin scale={pinScale} x={activePin.x} y={activePin.y} active>
              <button style={{ color: 'red', cursor: 'pointer', fontSize: '6rem', borderRadius: '5rem', position: 'absolute', margin: '-.6em 0 0 100px' }} onClick={deleteActivePin}>
                X&nbsp;Delete
              </button>
            </Pin>}
            {newPin && <Pin scale={pinScale} x={newPin.x} y={newPin.y}>
              <button style={{ color: 'blue', cursor: 'pointer', fontSize: '6rem', borderRadius: '5rem', position: 'absolute', margin: '-.6em 0 0 100px' }} onClick={addNewPin}>
                +&nbsp;Add
              </button>
            </Pin>}

          </TransformComponent>
          <div className="tools" style={{ position: "absolute", right: 0, top: 120, display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => resetTransform()}>x</button>
            <button onClick={() => zoomIn()}>+</button>
            <button onClick={() => zoomOut()}>-</button>
            {/* <div
              style={{
                position: "fixed",
                zIndex: 5,
                top: "50px",
                right: "50px",
              }}
            >
              <Map x={mapPos.x} y={mapPos.y} />
            </div> */}
          </div>
        </div>
      )}
    </TransformWrapper >
  )
}

const Preview = styled.button`
  background: ${f => f.selected ? 'lightgray' : 'none'};
  border: none;
  padding: 10px;
`;

const Pin = styled.button`
position: absolute;
font-size: 10rem;
left: ${p => p.x}px;
top: ${p => p.y}px;
margin-left: -5rem;
margin-top: -8rem;
cursor: pointer;
background:  ${p => p.active ? "red" : "blue"};
color:  ${p => p.active ? "red" : "blue"};
border: none;
width: 5rem;
height: 5rem;
border-radius: 2.5rem;
transform: scale(${p => p.scale});
border: .5rem solid white;
margin-top: -2.5rem;
margin-left: -2.5rem;
  text-shadow: -.3rem -.3rem 0 white, .3rem -.3rem 0 white, -.3rem .3rem 0 white, .3rem .3rem 0 white;
`;

// const Map = ({ x, y }) => <div style={{ overflow: 'hidden', border: '1px solid black', position: 'absolute', right: 100, top: 0, width: 150, height: 100, background: 'black' }}>
//   <div style={{ left: x * 150, top: y * 100, width: 100, height: 50, background: 'white', position: 'absolute' }}>

//   </div>
// </div>
