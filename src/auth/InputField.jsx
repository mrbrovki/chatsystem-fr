import { useEffect, useState } from "react";
import styled from "styled-components";

const StyledInput = styled.div`
    position: relative;
    height: 4rem;

    & > label{
      left: 1rem;
      top: 0.3rem;
      position: absolute;
      background-color: #fff;
      padding-right: 16px;
      padding-left: 8px;
    }

    & > input{
      width: 100%;
      height: 3rem;
      margin-top: 1rem;
      border-radius: 16px;
      padding-left: 16px;
      border: 2px solid #b9b9b9;

      &::placeholder{
        color: #b9b9b9;
      }

      &:focus{
       outline-color: #333333;
      }
    }

    & > img{
     position: absolute;
     right: 16px;
     bottom: 0.75rem;
     
     &:hover{
      cursor: pointer;
     }
    }
`;

const InputField = (props) => {
 const [type, setType] = useState(props.type);

 const togglePassword = (e) => {
  setType(prevType => prevType == "password" ? "text" : "password");
 }

 console.log("render " + type + " " + props.label);
 let eyeIcon = type == "password" ? 
  (<img src="./public/eye-closed-icon.svg" onClick={togglePassword} width={20} height={20}/>) :
  (<img src="./public/eye-open-icon.svg" onClick={togglePassword} width={20} height={20}/>);

 return (
 <StyledInput>
    <label htmlFor={props.label}>{props.label}</label>
    <input type={type} id={props.id} name={props.name} 
    placeholder={props.placeholder} onChange={props.handleChange} autoComplete={props.autoComplete}/>
   {props.isPassword && eyeIcon}

 </StyledInput>
 );
};

export default InputField;