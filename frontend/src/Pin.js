import styled from 'styled-components';

export const Pin = ({ scale, x, y, text, active, children = [] }) => (
  <Container scale={scale} x={x} y={y} active={active}>
    <PinMenu>
      {children}
      {<div style={{ textWrap: 'nowrap', fontSize: '6rem', borderRadius: '5rem', position: 'absolute', marginTop: '-18rem' }}>
        {text}
      </div>}
    </PinMenu>
  </Container>);

const PinMenu = styled.div`
  padding-top: 4rem;
  margin-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.button`
  position: absolute;
  font-size: 10rem;
  left: ${p => p.x}px;
  top: ${p => p.y}px;
  margin-left: -5rem;
  margin-top: -8rem;
  cursor: pointer;
  background:  ${p => p.active ? "#f5222d" : "#1677ff"};
  color:  ${p => p.active ? "#f5222d" : "#1677ff"};
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
