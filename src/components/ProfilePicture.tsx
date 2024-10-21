import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Context } from "../context";

const StyledProfilePicture = styled.img`
  border-radius: 50%;
  box-shadow: 0 0 2px #00000076;
  transition: transform 0.3s;
`;
interface ProfilePictureProps {
  width: number;
  height: number;
  handleClick: () => void;
}
const ProfilePicture = (props: ProfilePictureProps) => {
  const {
    state: { avatar },
  } = useContext(Context);

  const [currentSrc, setCurrentSrc] = useState("/user-icon.svg");

  useEffect(() => {
    if (!avatar) return;
    setCurrentSrc(avatar);
  }, [avatar]);

  return (
    <StyledProfilePicture
      src={currentSrc}
      width={props.width}
      height={props.height}
      onClick={props.handleClick}
    />
  );
};

export default ProfilePicture;
