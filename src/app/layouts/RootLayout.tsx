import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';

const RootLayout = () => {
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  );
};

export default RootLayout;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100dvh;
  background-color: white;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom)
    env(safe-area-inset-left);
`;
