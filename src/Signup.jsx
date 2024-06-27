import styled from "styled-components";
import InputField from "./auth/InputField";
import { useEffect, useState } from "react";
import { StyledButton, StyledForm } from "./Login";

const StyleSignup = styled.div`
  background-color: #ffffff;

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
const Signup = ({setMode}) => {
  const [formData, setFormData] = useState({username: "", email: "", 
    password: "", confirmedPassword: ""});
  const [isDisabled, setIsDisabled] = useState(true);

  const [isPasswordMatch, setIsPasswordMatch] = useState(true);

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

  const signup = (e) => {
    e.preventDefault();
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
    <p>Don't have an account? <span onClick={()=>{setMode("LOGIN")}}>Signup</span></p>
  </StyleSignup>
 );
}

export default Signup;