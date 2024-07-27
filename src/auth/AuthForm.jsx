import styled, { css } from "styled-components";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context";
import { getAuthHeader } from "../utils";
import Signup from "./Signup";
import Login from "./Login";

const StyledAuth = styled.main`
 background-color: grey;
 height: 100vh;
 width: 100%;
 display: flex;
 flex-flow: row nowrap;

 & > div{
  flex: 1;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  gap: 16px;
 }
`;

export const StyledLogoContainer = styled.div`
background: linear-gradient(to top, #43A5DC, #FF7BAC);;
 position: absolute;
 height: 100%;
 width: 50%;
 transform: translate(100%);

 ${props => {
  switch(props.$mode){
   case "LOGIN":
    return css`
     border-radius: 40px 0 0 40px;
    `;
   case "SIGNUP":
    return css`
     transform: translateX(0);
     border-radius: 0 40px 40px 0;
    `;
  }
 }}

 transition: transform 0.3s, border-radius 0.3s;
`;


const AuthForm = () => {
 const [mode, setMode] = useState("LOGIN");
  const {dispatch} = useContext(Context);

 const authenticate = async () => {
  const token = localStorage.getItem("jwt");
  if(token){
    const URL = 'http://localhost:8080/api/v2/users';
    let username = await (await fetch(URL, {headers: getAuthHeader()})).text();
    dispatch({type: "USERNAME", payload: username});
  }
}
  useEffect(()=>{
    authenticate()
  },[]);
  
 return(
  <StyledAuth>
   <Login setMode={setMode}/>
   <Signup setMode={setMode}/>
   <StyledLogoContainer $mode={mode}>
    <img src="./public/logo.svg" width={200} height={200}/>
   </StyledLogoContainer>
  </StyledAuth>
 );
}

export default AuthForm;