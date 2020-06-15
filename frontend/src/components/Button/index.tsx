import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
}; // its the same of interface ButtonProps extends ButtonHTMLAttributes<HTMLInputElement> {}

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
  <Container type="button" {...rest}>
    {/* a button alwais need type="button", but if I change it inside my page components, I change this original type="button" */}
    {loading ? 'Carregando...' : children}
  </Container>
);

export default Button;
