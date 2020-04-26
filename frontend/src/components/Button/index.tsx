import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>; // its the same of interface ButtonProps extends ButtonHTMLAttributes<HTMLInputElement> {}

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => (
  <Container type="button" {...rest}>
    {/* a button alwais need type="button", but if I change it inside my page components, I change this original type="button" */}
    {children}
  </Container>
);

export default Button;
