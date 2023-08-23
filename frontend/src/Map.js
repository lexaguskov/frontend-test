import { useEffect, useState, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Button, Input, Modal } from "antd";
import {
  HomeOutlined,
  PlusOutlined,
  CommentOutlined,
  DeleteOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import { Pin, PinButton } from "./Pin";
import styled from "styled-components";
import { useCachedImage } from "./hooks/useCachedImage";

// TODO: calculate initial scale
// TODO: minimap?

// FIXME: currently we're using only 2 levels of mipmaps (full scale and "/2" which is 1/16th of the area)
// full scale is shown with zoom factor 3 or more - all that is hardcoded and should be done in a smarter way
const MIPMAP_SUFFIX = "/2";
const MIPMAP_ZOOM_FACTOR = 3;

export const Map = ({ url, pins, onAddPin, onDeletePin, id }) => {
  const inputRef = useRef(null);

  const [selection, setSelection] = useState(null);
  const [newPin, setNewPin] = useState(null);

  // TRICKY: the map component reports clicks as pan events
  // so we're keeping coordinates to filter out real gestures from clicks
  // TODO: handle doubleclicks correctly - should not create a pin
  const panInfo = useRef({ x: 0, y: 0 });
  const onPanningStart = (e, j) => {
    panInfo.current = { x: j.offsetX, y: j.offsetY };
  };
  const onPanningStop = (e, j) => {
    if (j.target.tagName === "BUTTON") return; // pin is a <button>
    if (j.target.tagName === "SPAN") return; // antd button is a <span>
    const { offsetX, offsetY } = j;
    const dx = offsetX - panInfo.current.x;
    const dy = offsetY - panInfo.current.y;

    if (dx === 0 && dy === 0) {
      // okay, this is a click, not a pan gesture
      const newPin = { x: offsetX, y: offsetY };
      setNewPin(newPin);
    } else {
      setNewPin(null);
    }
    setSelection(null); // any gesture removes the selection
  };

  useEffect(() => {
    setNewPin(null);
    setSelection(null);
  }, [id]);

  // adding a pin
  const [pinText, setPinText] = useState("");
  const [pinModalShown, showPinTextModal] = useState(false);

  const onAddPinClick = async () => {
    setSelection(null);
    setPinText("New pin text");
    showPinTextModal(true);
    await new Promise((r) => setTimeout(r, 200));
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, 999999);
    }
  };

  const onPinModalOk = async () => {
    showPinTextModal(false);
    onAddPin({ ...newPin, text: pinText });
    setSelection(null);
    setNewPin(null);
    setPinText("");
  };

  const onPinModalCancel = () => {
    showPinTextModal(false);
    setPinText("");
  };

  // deleting a pin

  const onDeletePinClick = () => {
    onDeletePin(selection);
    setSelection(null);
    setNewPin(null);
  };

  // selecting a pin
  const onPinClick = (pin) => {
    setNewPin(null);
    setSelection(pin);
  };

  // TRICKY: we need to preserve scale of pins when zooming
  // there must a be a better way to do this that does not require a rerender (updating css?)
  const [pinScale, setPinScale] = useState(0);
  const onTransformed = (e) => {
    setPinScale(1 / e.state.scale);
  };

  const urlSmall = useCachedImage(url + MIPMAP_SUFFIX);
  const urlBig = useCachedImage(url);

  return (
    <>
      <TransformWrapper
        initialScale={0.5}
        minScale={0.5}
        maxScale={10}
        centerOnInit={true}
        onPanningStop={onPanningStop}
        onPanningStart={onPanningStart}
        onTransformed={onTransformed}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <>
            <TransformComponent
              wrapperStyle={{
                maxWidth: "100%",
                maxHeight: "calc(100vh - 100px)",
              }}
            >
              <img src={urlSmall} alt="" />
              <FullScaleImage
                src={urlBig}
                scale={rest.instance.transformState.scale}
                alt=""
              />
              {pins
                .filter((p) => p !== selection && p !== newPin)
                .map((p) => (
                  <Pin
                    text={p.text}
                    scale={pinScale}
                    key={`${p.x}.${p.y}`}
                    x={p.x}
                    y={p.y}
                    onClick={() => onPinClick(p)}
                  />
                ))}
              {selection && (
                <Pin
                  text={selection.text}
                  scale={pinScale}
                  x={selection.x}
                  y={selection.y}
                  active
                >
                  <PinButton
                    danger
                    icon={<DeleteOutlined />}
                    onClick={onDeletePinClick}
                  >
                    Delete pin
                  </PinButton>
                </Pin>
              )}
              {newPin && (
                <Pin text={pinText} scale={pinScale} x={newPin.x} y={newPin.y}>
                  {pinModalShown || (
                    <PinButton
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={onAddPinClick}
                    >
                      Add pin
                    </PinButton>
                  )}
                </Pin>
              )}
            </TransformComponent>
            <Toolbar>
              <ToolbarButton
                icon={<HomeOutlined />}
                onClick={() => resetTransform()}
              />
              <ToolbarButton icon={<PlusOutlined />} onClick={() => zoomIn()} />
              <ToolbarButton
                icon={<MinusOutlined />}
                onClick={() => zoomOut()}
              />
            </Toolbar>
          </>
        )}
      </TransformWrapper>
      <Modal
        title="Add pin"
        open={pinModalShown}
        onOk={onPinModalOk}
        onCancel={onPinModalCancel}
        closable={false}
      >
        <Input
          prefix={<CommentOutlined />}
          value={pinText}
          onChange={(e) => setPinText(e.target.value)}
          ref={inputRef}
          onPressEnter={onPinModalOk}
        />
      </Modal>
      <Footer>
        {newPin && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAddPinClick}
          >
            Add pin
          </Button>
        )}
        {selection && (
          <Button danger icon={<DeleteOutlined />} onClick={onDeletePinClick}>
            Delete pin
          </Button>
        )}
      </Footer>
    </>
  );
};

const FullScaleImage = styled.img`
  display: ${(p) => (p.scale >= MIPMAP_ZOOM_FACTOR ? undefined : "none")};
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

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
