import { useEffect, useState, useRef } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Button, Input, Modal } from "antd";
import { HomeOutlined, PlusOutlined, CommentOutlined, DeleteOutlined, MinusOutlined } from '@ant-design/icons';
import { Pin, PinButton } from './Pin';
import styled from 'styled-components';

// TODO: calculate initial scale
// TODO: load mipmaps
// TODO: minimap?
export const Map = ({ url, pins, onAddPin, onDeletePin, id }) => {
  const inputRef = useRef(null);

  const [activePin, setActivePin] = useState(null);
  const [newPin, setNewPin] = useState(null);

  const panInfo = useRef({ x: 0, y: 0 });

  const onPanningStart = (e, j) => {
    panInfo.current = { x: j.offsetX, y: j.offsetY };
  }
  const onPanningStop = (e, j) => {
    if (j.target.tagName === "BUTTON") return;
    if (j.target.tagName === "SPAN") return;
    const { offsetX, offsetY } = j;
    const dx = offsetX - panInfo.current.x;
    const dy = offsetY - panInfo.current.y;

    if (dx === 0 && dy === 0) {
      const newPin = { x: offsetX, y: offsetY }
      setNewPin(newPin);
    } else {
      setNewPin(null);
    }
    setActivePin(null);
  }

  useEffect(() => {
    setNewPin(null);
    setActivePin(null);
  }, [id]);

  const deleteActivePin = () => {
    onDeletePin(activePin);
    setActivePin(null);
    setNewPin(null); // just in case
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

  const onPinAdded = async () => {
    showPinTextModal(false);
    onAddPin({ ...newPin, text: pinText });
    setActivePin(null);
    setNewPin(null);
    setPinText('');
  }

  const [pinScale, setPinScale] = useState(0);
  const onPan = (e) => {
    setPinScale(1 / e.state.scale);
  }

  const onSelectPin = (pin) => {
    setNewPin(null);
    setActivePin(pin)
  };

  return (
    <>
      <TransformWrapper
        initialScale={0.5}
        minScale={0.5}
        maxScale={10}
        centerOnInit={true}
        onPanningStop={onPanningStop}
        onPanningStart={onPanningStart}
        onTransformed={onPan}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <TransformComponent
              wrapperStyle={{ maxWidth: "100%", maxHeight: "calc(100vh - 100px)" }}
            >
              <img src={url} alt="" />
              {pins
                .filter(p => p !== activePin && p !== newPin)
                .map((p) =>
                  <Pin text={p.text} scale={pinScale} key={`${p.x}.${p.y}`} x={p.x} y={p.y} onClick={() => onSelectPin(p)} />
                )}
              {activePin && <Pin text={activePin.text} scale={pinScale} x={activePin.x} y={activePin.y} active>
                <PinButton danger icon={<DeleteOutlined />} onClick={deleteActivePin}>
                  Delete pin
                </PinButton>
              </Pin>}
              {newPin && <Pin text={pinText} scale={pinScale} x={newPin.x} y={newPin.y}>
                {pinModalShown || (
                  <PinButton type="primary" icon={<PlusOutlined />} onClick={addNewPin}>
                    Add pin
                  </PinButton>
                )}
              </Pin>}
            </TransformComponent>
            <Toolbar>
              <ToolbarButton icon={<HomeOutlined />} onClick={() => resetTransform()} />
              <ToolbarButton icon={<PlusOutlined />} onClick={() => zoomIn()} />
              <ToolbarButton icon={<MinusOutlined />} onClick={() => zoomOut()} />
            </Toolbar>
          </>
        )}
      </TransformWrapper >
      <Modal title="Add pin" open={pinModalShown} onOk={onPinAdded} onCancel={() => showPinTextModal(false)} closable={false}>
        <Input prefix={<CommentOutlined />} value={pinText} onChange={(e) => setPinText(e.target.value)} ref={inputRef} />
      </Modal>
      <Footer>
        {newPin && <Button type="primary" icon={<PlusOutlined />} onClick={addNewPin}>
          Add pin
        </Button>}
        {activePin && <Button danger icon={<DeleteOutlined />} onClick={deleteActivePin}>
          Delete pin
        </Button>}
      </Footer>
    </>
  )
}

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: none; /* Hide on desktop */
  padding: 16px;
  @media (max-width: 768px) { 
    display: flex; /* Show the footer on mobile devices */
    justify-content: center;
  }
`;

const Toolbar = styled.div`
  padding: 16px;
  position: absolute;
  right: 0;
  top: 180px;
  display: flex;
  flex-direction: column;
`;

const ToolbarButton = styled(Button)`
  margin-top: 8px;
`;
