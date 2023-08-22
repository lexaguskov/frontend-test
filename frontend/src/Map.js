import { useEffect, useState, useRef } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Button, Input, Modal } from "antd";
import { HomeOutlined, PlusOutlined, CommentOutlined, DeleteOutlined, MinusOutlined } from '@ant-design/icons';
import { Pin } from './Pin';
import styled from 'styled-components';


const pinDb = {};
const getPinsForImage = (img) => {
  return pinDb[img] || [];
}

const setPinsForImage = (img, pins) => {
  pinDb[img] = pins;
}

// FIXME: calculate initial zoom factor
// TODO: local file cache
// TODO: mobile version
// FIXME: calculate initial zoom factor
// TODO: store pins on server

// TODO: calculate initial scale
export const Map = ({ url, onUpdateMap, id }) => {
  const inputRef = useRef(null);

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
    if (j.target.tagName === "SPAN") return;
    const { offsetX, offsetY } = j;
    const dx = offsetX - panInfo.current.x;
    const dy = offsetY - panInfo.current.y;

    if (dx === 0 && dy === 0) {
      const newPin = { x: offsetX, y: offsetY }
      setNewPin(newPin);
      setActivePin(null);
    }
  }

  useEffect(() => {
    setPins(getPinsForImage(id));
    setNewPin(null);
    setActivePin(null);
  }, [id]);

  const deleteActivePin = () => {
    setPins(p => p.filter(pin => pin !== activePin));
    setPinsForImage(id, pins.filter(pin => pin !== activePin));
    setActivePin(null);
  }

  const [pinText, setPinText] = useState('');
  const [pinModalShown, showPinTextModal] = useState(false);

  const addNewPin = async () => {
    setActivePin(null);
    setPinText('New pin text');
    showPinTextModal(true);
    await new Promise(r => setTimeout(r, 200));
    console.log('inpu', inputRef)
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, 999999);
    }
  }

  const handleSetPinText = async () => {
    showPinTextModal(false);
    setPins(p => [...p, { ...newPin, text: pinText }]);
    setPinsForImage(id, [...pins, { ...newPin, text: pinText }]);
    setActivePin(null);
    setNewPin(null);
    setPinText('');
  }

  const [pinScale, setPinScale] = useState(0);
  const onPan = (e) => {
    setPinScale(0.2 * 1 / e.state.scale);
  }

  return (
    <>
      <TransformWrapper
        style={{ width: "100vw" }}
        initialScale={0.5}
        minScale={0.5}
        centerOnInit={true}
        onPanningStop={onPin}
        onPanningStart={onPanningStart}
        onTransformed={onPan}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <Container>
            <TransformComponent
              wrapperStyle={{ maxWidth: "100%", maxHeight: "calc(100vh - 100px)" }}
            >
              <img src={url} alt="" />
              {pins.filter(p => p !== activePin && p !== newPin).map((p) =>
                <Pin text={p.text} scale={pinScale} key={`${p.x}.${p.y}`} x={p.x} y={p.y} onClick={() => { setNewPin(null); setActivePin(p) }} />
              )}
              {activePin && <Pin text={activePin.text} scale={pinScale} x={activePin.x} y={activePin.y} active>
                <Button style={{ transform: 'scale(5)', margin: '2rem -10rem' }} danger icon={<DeleteOutlined />} onClick={deleteActivePin}>Delete pin</Button>
              </Pin>}
              {newPin && <Pin text={pinText} scale={pinScale} x={newPin.x} y={newPin.y}>
                {pinModalShown || <Button style={{ transform: 'scale(5)', margin: '2rem -10rem' }} type="primary" icon={<PlusOutlined />} onClick={addNewPin}>Add pin</Button>}
              </Pin>}
            </TransformComponent>
            <Toolbar>
              <Button style={{ marginTop: 8 }} icon={<HomeOutlined />} onClick={() => resetTransform()}></Button>
              <Button style={{ marginTop: 8 }} icon={<PlusOutlined />} onClick={() => zoomIn()}></Button>
              <Button style={{ marginTop: 8 }} icon={<MinusOutlined />} onClick={() => zoomOut()}></Button>
            </Toolbar>
          </Container>
        )}
      </TransformWrapper >
      <Modal title="Add pin" open={pinModalShown} onOk={handleSetPinText} onCancel={() => showPinTextModal(false)} closable={false}>
        <Input prefix={<CommentOutlined />} value={pinText} onChange={(e) => setPinText(e.target.value)} ref={inputRef} />
      </Modal>
    </>
  )
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Toolbar = styled.div`
  padding: 16px;
  position: absolute;
  right: 0;
  top: 180px;
  display: flex;
  flexDirection: column;
`;
