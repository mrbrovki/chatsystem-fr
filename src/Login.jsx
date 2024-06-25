/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useContext, useState } from "react";
import { getAuthHeader } from "./utils";
import { Context } from "./context";
import styled from "styled-components";

const StyledLogin = styled.div`
  background-color: white;

  & > p{
    text-align: center;
    font-size: 3rem;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  max-width: 500px;
  margin: 0 auto 0;
  
  gap: 1rem 0;

   & > div{
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
    }


  }
`;

const StyledButton = styled.button`
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
`



export default function Login(){
const {dispatch} = useContext(Context);

const [formData, setFormData] = useState({ username: "user1@example.com", password: "1234" });

const login = async (e) => {
 e.preventDefault();
 const URL = 'http://localhost:8080/api/v2/auth/login';
 let response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

  let token = (await response.json()).accessToken;
  localStorage.setItem("jwt", token);
    console.log("here")
  dispatch({type: "USERNAME", payload: formData.username});
}

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

const authenticate = async () => {
  const token = localStorage.getItem("jwt");
  if(token){
    const URL = 'http://localhost:8080/api/v2/users';
    let username = await (await fetch(URL, {headers: getAuthHeader()})).text();
    dispatch({type: "USERNAME", payload: username});
  }
}

  console.log("trigger")
 return (
  <StyledLogin>
  <p>Welcome Back</p>
  <StyledForm id="login" name="login">
    <div>
      <label for="username">Username</label>
    <input type="text" id="username" name="username" 
    placeholder="Enter username here" onChange={handleChange}/>
    </div>
    <div>
      <label for="password">Password</label>
      <input type="password" id="password" name="password" 
    placeholder="Enter password here" onChange={handleChange}/>
    </div>

    
    <StyledButton type="submit" onClick={login} $isDark>Login</StyledButton>
    <StyledButton type="submit" onClick={login}>Demo Login</StyledButton>
   </StyledForm>
  </StyledLogin>
 )
}