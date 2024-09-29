import { ChangeEvent } from "react";
import styled from "styled-components";

interface AvatarUploadProps {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  htmlFor: string;
  name: string;
  id: string;
  currentSrc: string;
}
const StyledImageUpload = styled.div`
  display: flex;

  label {
    width: 100%;
    position: relative;
  }
  input[type="file"] {
    display: none;
  }
  img {
    display: block;
    margin: 0 auto;
    width: 120px;
    height: 120px;
    border-radius: 100%;
    box-shadow: 0 0 5px #00000056;
  }

  img:nth-of-type(2) {
    cursor: pointer;
    transition: all 0.3s;
    background-color: #2b2e6180;
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    &:hover {
      opacity: 0.7;
    }
  }
`;

const AvatarUpload = (props: AvatarUploadProps) => {
  return (
    <StyledImageUpload>
      <label htmlFor={props.htmlFor}>
        <input
          type="file"
          onChange={props.handleChange}
          name={props.name}
          id={props.id}
        />
        <img src={props.currentSrc} />
        <img src="./camera-icon.svg" />
      </label>
    </StyledImageUpload>
  );
};

export default AvatarUpload;
