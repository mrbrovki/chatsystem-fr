import styled from "styled-components";

const StyleSignup = styled.div`
  background-color: #b33b3b;
`;
const Signup = () => {
 return(
  <StyleSignup>
  signup
  <form id="login" name="login">
    <input type="text" id="username" name="username" 
    placeholder="Username"/>

    <input type="password" id="password" name="password" 
    placeholder="Password"/>
    <button type="submit">Start Chatting</button>
   </form>
   
  </StyleSignup>
 );
}

export default Signup;