import styled from "styled-components";
import Login from "./Login";
import Signup from "./Signup";

const StyledAuth = styled.main`
 background-color: grey;
 height: 100vh;
 width: 100%;
 display: flex;
 flex-flow: row nowrap;
 
 & > div{
  flex: 1;
  padding: 96px;
 }
`;

const AuthForm = () => {
 return(
  <StyledAuth>
   <Login />
   <Signup />
  </StyledAuth>
 );
}

export default AuthForm;