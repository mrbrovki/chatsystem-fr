/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {getAuthHeader} from "./utils";
import styled from "styled-components";
const ProfilePicture = styled.img`
  width: 60%;
  border-radius: 50%;
  box-shadow: 0 0 2px #00000076;
  transition: transform 0.3s;
`;

const StyledSidebar = styled.aside`
 width: 120px;
 display: flex;
 flex-flow: column nowrap;
 align-items: center;
 background: linear-gradient(to top, #43A5DC, #FF7BAC);
 padding: 30px 10px;

 & > div{
  height: 140px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  background-color: #ffffff35;
  border-radius: 12px;
  transition: background-color 0.3s;

  gap: 10px;
  
  & > p{
    color: white;
    font-family: "Quicksand", sans-serif;
    font-optical-sizing: auto;
    font-weight: 700;
    font-style: normal;
  }
  &:hover{
  background-color: #ffffff63;

  ${ProfilePicture}{
    transform: scale(1.1);
  }
 }
 }
 & > *:hover{
  cursor: pointer;
 }
`; 

const LogoutIcon = styled.img`
  width: 80%;
 margin-top: auto; 
 transform: scale(1);
 transition: transform 0.3s;

 &:hover{
  transform: scale(1.1);
 }
`; 

export default function Sidebar(props){
  
  const logout = () => {
    localStorage.removeItem("jwt");
    props.setUsername("");
  }

  

 return(
   <StyledSidebar>
      <div>
        <ProfilePicture src={`https://api.multiavatar.com/${props.username}.svg?apiKey=7UHNFoPLjsVJCi`}/>
        <p>Profile</p>
      </div>
      <LogoutIcon src="./public/logout-icon.svg" onClick={logout}/>
   </StyledSidebar>
  );
}