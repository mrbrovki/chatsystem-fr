import { ChangeEventHandler, forwardRef, useState } from "react";
import styled, { css } from "styled-components";

const StyledInputContainer = styled.div<{
  $isError: boolean;
  $errorContent: string;
}>`
  position: relative;
  height: 4.5rem;

  & > label {
    left: 1rem;
    top: -0.1rem;
    position: absolute;
    background-color: #fff;
    padding-right: 16px;
    padding-left: 8px;
  }

  & > input {
    width: 100%;
    margin-top: 0.5rem;
    height: 3rem;
    border-radius: 16px;
    padding-left: 16px;
    border: 2px solid #b9b9b9;

    &::placeholder {
      color: #b9b9b9;
    }

    &:focus {
      outline-color: #333333;
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
  ${({ $isError, $errorContent }) => {
    if ($isError) {
      return css`
        &::after {
          display: block;
          padding-left: 16px;
          font-size: 0.8rem;
          content: "${$errorContent}";
          color: #cc0d0d;
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
