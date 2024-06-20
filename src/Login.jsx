/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState } from "react";
import { getAuthHeader } from "./utils";

export default function Login(props){
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
  
  // eslint-disable-next-line react/prop-types
  props.setUsername(formData.username);
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
    props.setUsername(username);
  }
}
  authenticate();
 return (
  <>
  <form id="login" name="login">
    <input type="text" id="username" name="username" 
    placeholder="Username" onChange={handleChange}/>

    <input type="password" id="password" name="password" 
    placeholder="Password" onChange={handleChange}/>
    <button type="submit" onClick={login}>Start Chatting</button>
   </form>
  </>
 )
}