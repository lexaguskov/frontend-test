import styled from 'styled-components';
import { Button } from 'antd';

export const Pin = ({ scale, x, y, text, active, children = [], onClick = null }) => (
  <Container scale={scale} x={x} y={y} active={active} onClick={onClick}>
    <PinStroke>{text}</PinStroke>
    <PinText>{text}</PinText>
    {children}
  </Container>);

export const PinButton = styled(Button)`
  margin: 24px 0;
`;

const PinStroke = styled.div`
  text-wrap: nowrap;
  font-size: 20px;
  position: absolute;
  margin-top: -36px;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 3px;
  color: white;
`

const PinText = styled.div`
  text-wrap: nowrap;
  font-size: 20px;
  position: absolute;
  margin-top: -36px;
`;

const Container = styled.button`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  position: absolute;
  left: ${p => p.x}px;
  top: ${p => p.y}px;
  cursor: pointer;
  background:  ${p => p.active ? "#f5222d" : "#1677ff"};
  color:  ${p => p.active ? "#f5222d" : "#1677ff"};
  border: none;
  transform: scale(${p => p.scale});
  border: 2px solid white;
  margin-top: -6px;
  margin-left: -8px;

  display: flex;
  flex-direction: column;
  align-items: center;
`;
