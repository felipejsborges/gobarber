import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: block;
  flex-direction: column;

  max-width: 700px;

  div {
    margin: 16px;
    padding: 16px;
  }

  a {
    display: flex;
    margin: 16px;
    padding: 16px;
    background: #ff9000;
    height: 56px;
    border-radius: 10px;
    border: 0;
    padding: 0 16px;
    color: #312e28;
    font-weight: 500;
    transition: background-color 0.2;
    align-items: center;
    justify-content: center;

    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }
  }
`;
