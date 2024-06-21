import styled from "styled-components";

const StyledAvatar = styled.img`
  box-shadow: 0 0 2px #00000072;
  border-radius: 48px;
  float: left;
`;

export default function ChatItem({chat}){
 const defaultURL = `https://api.multiavatar.com/${chat.name}.svg`;
    let avatarURL = chat.avatar || defaultURL;

 return(<>
  <StyledAvatar src={`${avatarURL}?apiKey=${process.env.AVATAR_API}`} height={48} width={48} />
   <div>{chat.name}</div>
 </>);
}