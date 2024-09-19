import styled, { css } from "styled-components";
import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import InputField from "../components/InputField";
import { StyledButton, StyledForm } from "../App";
import { AuthMode, SignupFormData } from "../constants";
import { fetchSignup } from "../utils/utils";

const StyleSignup = styled.div`
  background-color: #ffffff;
  position: relative;

  & > div {
    text-align: center;
    font-size: 3rem;
  }

  & > p > span {
    color: #0a7dbd;

    &:hover {
      cursor: pointer;
    }
  }
`;

const StyledCheck = styled.img<{ $isChecked: boolean }>`
  position: absolute;
  align-self: center;
  ${({ $isChecked }) => {
    if ($isChecked) {
      return css`
        width: 200px;
        height: 200px;
        transition: all 0.3s;
      `;
    } else {
      return css`
        width: 0;
        height: 0;
      `;
    }
  }}
`;

interface SignupProps {
  setMode: Dispatch<SetStateAction<AuthMode>>;
}

const Signup = ({ setMode }: SignupProps) => {
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
    confirmedPassword: "",
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const { username, email, password, confirmedPassword } = formData;

    if (username && email && password && confirmedPassword) {
      setIsDisabled(password !== confirmedPassword);
    }
  }, [formData]);

  const signup = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await fetchSignup(formData);
    if (response) {
      setIsChecked(true);
      setTimeout(() => {
        setMode(AuthMode.LOGIN);
        setIsChecked(false);
      }, 1000);
    }
  };

  return (
    <StyleSignup>
      <div>Get started</div>
      <StyledForm>
        <InputField
          type="text"
          label="Display Name"
          id="signup-username"
          placeholder="Enter username here"
          name="username"
          handleChange={handleChange}
        />

        <InputField
          type="email"
          label="Email"
          id="signup-email"
          placeholder="Enter email here"
          name="email"
          handleChange={handleChange}
          autoComplete="off"
        />

        <InputField
          type="password"
          label="Password"
          placeholder="Enter password here"
          id="signup-password"
          handleChange={handleChange}
          name="password"
          isPassword
          autoComplete="new-password"
        />

        <InputField
          type="password"
          label="Confirm Password"
          placeholder="Confirm password here"
          id="signup-confirmed-password"
          handleChange={handleChange}
          name="confirmedPassword"
          isPassword
          autoComplete="new-password"
        />

        {formData.password === formData.confirmedPassword || (
          <div>passwords dont match!</div>
        )}

        <StyledButton
          type="submit"
          onClick={signup}
          $isDisabled={isDisabled}
          $isDark
        >
          Signup
        </StyledButton>
      </StyledForm>
      <p>
        Already registered?{" "}
        <span
          onClick={() => {
            setMode(AuthMode.LOGIN);
          }}
        >
          Login
        </span>
      </p>
      <StyledCheck src="./public/check-icon.svg" $isChecked={isChecked} />
    </StyleSignup>
  );
};

export default Signup;
