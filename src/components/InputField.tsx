import { ChangeEventHandler, forwardRef, useState } from "react";
import styled, { css } from "styled-components";

const StyledInputContainer = styled.div<{
  $isError: boolean;
  $errorContent: string;
  $priority: "primary" | "secondary";
}>`
  position: relative;
  margin: 0.5rem 0;
  height: 3.5rem;

  & > label {
    font-size: 1rem;
    left: 1rem;
    position: absolute;
    background: ${({ theme, $priority }) => {
      const topBg = theme.colors.panel.background;
      const bottomBg = theme.colors.input[$priority].background;
      return css`
        linear-gradient(to bottom, ${topBg} 50%, ${bottomBg} 50%);
      `;
    }};
    padding-right: 8px;
    padding-left: 8px;
    color: ${({ theme, $priority }) => theme.colors.input[$priority].label};
  }

  & > input {
    border: none;
    width: 100%;
    margin-top: 0.5rem;
    height: 3rem;
    border-radius: 16px;
    padding-left: 16px;
    outline: 2px solid
      ${({ theme, $priority }) => theme.colors.input[$priority].outline};
    background-color: ${({ theme, $priority }) =>
      theme.colors.input[$priority].background};

    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    ${({ $priority }) => {
      if ($priority === "secondary") {
        return css`
          box-shadow: 0 0 8px #00000026;
          outline: none;
        `;
      }
    }}

    &::placeholder {
      color: ${({ theme, $priority }) =>
        theme.colors.input[$priority].placeholder};
    }

    &:focus {
      outline-color: ${({ theme, $priority }) =>
        theme.colors.input[$priority].focus};
    }
  }

  & > img {
    position: absolute;
    right: 16px;
    top: 1.5rem;

    &:hover {
      cursor: pointer;
    }
  }

  ${({ $isError, $errorContent, $priority, theme }) => {
    if ($isError) {
      return css`
        &::after {
          display: block;
          padding-left: 16px;
          font-size: 0.8rem;
          content: "${$errorContent}";
          color: ${theme.colors.input[$priority].error};
        }
      `;
    }
  }}
`;

interface InputProps {
  name: string;
  type: string;
  id: string;
  label?: string;
  placeholder?: string;
  handleChange?: ChangeEventHandler<HTMLInputElement>;
  autoComplete?: string;
  value?: string;
  isPassword?: boolean;
  isError?: boolean;
  errorContent?: string;
  priority: "primary" | "secondary";
  children?: ChildNode;
  className?: string;
}

const InputField = forwardRef((props: InputProps, ref: any) => {
  const [type, setType] = useState(props.type);

  const togglePassword = () => {
    setType((prevType) => (prevType == "password" ? "text" : "password"));
  };

  const eyeIcon =
    type == "password" ? (
      <img
        src="/eye-closed-icon.svg"
        onClick={togglePassword}
        width={20}
        height={20}
      />
    ) : (
      <img
        src="/eye-open-icon.svg"
        onClick={togglePassword}
        width={20}
        height={20}
      />
    );

  return (
    <StyledInputContainer
      $isError={props.isError || false}
      $errorContent={props.errorContent || ""}
      $priority={props.priority}
      className={props.className}
    >
      <label htmlFor={props.label}>{props.label}</label>
      <input
        type={type}
        id={props.id}
        name={props.name}
        placeholder={props.placeholder}
        onChange={props.handleChange}
        autoComplete={props.autoComplete}
        value={props.value}
        ref={ref}
      />
      {props.isPassword && eyeIcon}
    </StyledInputContainer>
  );
});

export default InputField;
