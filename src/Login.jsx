/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useContext, useState } from "react";
import { getAuthHeader } from "./utils";
import { Context } from "./context";
import styled, { css } from "styled-components";
import InputField from "./auth/InputField";

const StyledLogin = styled.div`
  background-color: white;

  & > div{
    text-align: center;
    font-size: 3rem;
  }

  & > p > span{
    color: #0A7DBD;

    &:hover{
      cursor: pointer;
    }
  }
`;

export const StyledForm = styled.form`
  display: flex;
  flex-flow: column nowrap;
  width: 80%;
  max-width: 500px;
  margin: 0 auto 0;
  gap: 1rem 0;
 
`;

export const StyledButton = styled.button`
  height: 3rem;
  background-color: ${({$isDark}) => $isDark ? "#000": "#fff"};
  color: ${({$isDark}) => $isDark ? "#ffffff": "#000000"};
  font-size: 1rem;
  border-radius: 8px;
  transition: color 0.3s, background-color 0.3s;

  &:hover{
    background-color: ${({$isDark}) => $isDark ? "#ffffff": "#000000"};
    color: ${({$isDark}) => $isDark ? "#000000": "#ffffff"};
    cursor: pointer;
  }

  ${props => {
    if(props.$isDisabled){
      return css`
      opacity: 0.6;
        &:hover{
          background-color: ${({$isDark}) => $isDark ? "#000": "#fff"};
          color: ${({$isDark}) => $isDark ? "#ffffff": "#000000"};
        }
      `;
    }
  }}
`



export default function Login({setMode}){
const {dispatch} = useContext(Context);

const [formData, setFormData] = useState({ username: "user1@example.com", password: "1234" });

const login = async (e) => {
 e.preventDefault();
 const URL = 'http://localhost:8080/api/v3/auth/login';
 let response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

  let token = (await response.json()).accessToken;
  localStorage.setItem("jwt", token);
  dispatch({type: "USERNAME", payload: formData.username});
}

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};


 return (
  <StyledLogin>
  <div>Welcome Back</div>
  <StyledForm id="login" name="login">
    
    <InputField type="text" label="Username" id="login-username"
    placeholder="Enter username here" handleChange={handleChange} name="username" autoComplete="off"/>
    
    <InputField type="password" label="password" name="password"
    placeholder="Enter password here" id="login-password"
    handleChange={handleChange} isPassword autoComplete="current-password" />

    <StyledButton type="submit" onClick={login} $isDark>Login</StyledButton>
    <StyledButton type="submit" onClick={login}>Demo Login</StyledButton>
   </StyledForm>
   <p>Don't have an account? <span onClick={()=>{setMode("SIGNUP")}}>Signup</span></p>
  </StyledLogin>
 )
}