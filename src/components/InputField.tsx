import { ChangeEventHandler, useState } from "react";
import styled from "styled-components";

const StyledInputContainer = styled.div`
  position: relative;
  height: 4rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;

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

    &:hover {
      cursor: pointer;
    }
  }
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
}

const InputField = (props: InputProps) => {
  const [type, setType] = useState(props.type);

  const togglePassword = () => {
    setType((prevType) => (prevType == "password" ? "text" : "password"));
  };

  const eyeIcon =
    type == "password" ? (
      <img
        src="./public/eye-closed-icon.svg"
        onClick={togglePassword}
        width={20}
        height={20}
      />
    ) : (
      <img
        src="./public/eye-open-icon.svg"
        onClick={togglePassword}
        width={20}
        height={20}
      />
    );

  return (
    <StyledInputContainer>
      <label htmlFor={props.label}>{props.label}</label>
      <input
        type={type}
        id={props.id}
        name={props.name}
        placeholder={props.placeholder}
        onChange={props.handleChange}
        autoComplete={props.autoComplete}
        value={props.value}
      />
      {props.isPassword && eyeIcon}
    </StyledInputContainer>
  );
};

export default InputField;
