import styled from "styled-components";
import { BtnPriority } from "../context/types";
import { ReactNode } from "react";

const StyledButton = styled.button<{
  $priority: BtnPriority;
}>`
  height: 3rem;
  width: 100%;
  max-width: 40rem;
  background-color: ${({ theme, $priority }) =>
    theme.colors.buttons[$priority].background};
  color: ${({ theme, $priority }) => theme.colors.buttons[$priority].text};
  font-size: 1rem;
  border: 2px solid
    ${({ theme, $priority }) => theme.colors.buttons[$priority].border};
  border-radius: 8px;
  transition: color 0.3s, background-color 0.3s;
  margin: 1rem auto 0 auto;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme, $priority }) =>
      theme.colors.buttons[$priority].hover.background};
    border-color: ${({ theme, $priority }) =>
      theme.colors.buttons[$priority].hover.border};
    color: ${({ theme, $priority }) =>
      theme.colors.buttons[$priority].hover.text};
  }
  &[disabled] {
    opacity: 0.5;
  }
`;
const Button: React.FC<{
  priority: BtnPriority;
  type: "button" | "submit" | "reset";
  handleClick: any;
  isDisabled?: boolean;
  children: ReactNode;
}> = ({ priority, type, handleClick, children, isDisabled }) => {
  return (
    <StyledButton
      type={type}
      onClick={handleClick}
      $priority={priority}
      disabled={isDisabled}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
