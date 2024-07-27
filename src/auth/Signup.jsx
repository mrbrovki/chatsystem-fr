import styled, { css } from "styled-components";
import { useEffect, useState } from "react";
import { StyledButton, StyledForm } from "./Login";
import InputField from "./InputField";

const StyleSignup = styled.div`
  background-color: #ffffff;
  position: relative;

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

const StyledCheck = styled.img`
  position: absolute;
  align-self: center;
  ${props => {
    if(props.$isChecked){
      return css`
        width: 200px;
        height: 200px;
        transition: all 0.3s;
      `;
    }else{
      return css`
        width: 0;
        height: 0;
      `;
    }
  }}
  
`;

const Signup = ({setMode}) => {
  const [formData, setFormData] = useState({username: "", email: "", 
    password: "", confirmedPassword: ""});
  const [isDisabled, setIsDisabled] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(()=>{
    const {username, email, password, confirmedPassword} = formData;

    if(username && email && password && confirmedPassword){
      setIsDisabled(password !== confirmedPassword);
    }
  }, [formData]);

  const signup = async (e) => {
    e.preventDefault();
    const SIGNUP_URL = "http://localhost:8080/api/v3/auth/signup";
    const {username, email, password} = formData;
    const response = await fetch(SIGNUP_URL, {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
      headers: {
      "Content-Type": "application/json"
      }
    });
    if(response.ok){
        setIsChecked(true);
      setTimeout(() => {
        setMode("LOGIN");
        setIsChecked(false);
      }, 1000);
    }
  }

 return(
  <StyleSignup>
    <div>Get started</div>
    <StyledForm>
      <InputField type="text" label="Display Name" id="signup-username"
        placeholder="Enter username here" name="username" handleChange={handleChange} />

      <InputField type="email" label="Email" id="signup-email"
        placeholder="Enter email here" name="email" handleChange={handleChange} autoComplete="off"/>

      <InputField type="password" label="Password" 
        placeholder="Enter password here" id="signup-password"
        handleChange={handleChange} name="password" isPassword autoComplete="new-password"/>

      <InputField type="password" label="Confirm Password" 
        placeholder="Confirm password here" id="signup-confirmed-password"
        handleChange={handleChange} name="confirmedPassword" isPassword autoComplete="new-password"/>


    {formData.password === formData.confirmedPassword || <div>passwords dont match!</div>}

    <StyledButton type="submit" onClick={signup} $isDisabled={isDisabled} $isDark>Signup</StyledButton>
    </StyledForm>
    <p>Already registered? <span onClick={()=>{setMode("LOGIN")}}>Login</span></p>
    <StyledCheck src="./public/check-icon.svg" $isChecked={isChecked} />
  </StyleSignup>
 );
}

export default Signup;