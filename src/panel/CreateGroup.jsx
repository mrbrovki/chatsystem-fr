import { useContext, useState } from "react";
import styled from "styled-components";
import { Context } from "../context";
import ChatItem from "../ChatItem";

const StyledUserChats = styled.div`
  padding: 20px;

  & > h1{
    font-weight: 700;
    float: left;
  }
  & > img{
    float: right;
  }
`;

const StyledChats = styled.div`
  & > div{
    clear: both;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 10px;
    padding: 10px 0;

    &:hover{
      box-shadow: 0 0 2px #0000002e;
      border-radius: 20px;
      cursor: pointer;
    }
  }
`;

const CreateGroup = () => {
 const [groupData, setGroupData] = useState({name: ""});
 const {state: {chats}, dispatch} = useContext(Context);
  const [users, setUsers] = useState([]);

 const handleChange = (e) => {
  const { name, value } = e.target;
  setGroupData(groupData => ({ ...groupData, [name]: value }));
};
  const handleClick = (e) =>{
    console.log(e.currentTarget.getAttribute("data-name"));
    e.currentTarget
  }
 return(
  <>
    <StyledUserChats>
    <StyledChats>
      {chats.map(chat => { 
    return(
         <ChatItem chat={chat} key={chat.name}
        data-type={chat.type} 
        data-id={chat.id}
        data-name={chat.name} handleClick={handleClick}/>
      )})}
    </StyledChats>
  </StyledUserChats>
  </>
 );
}
// <InputField type="text" label="Group name" id="group-name" placeholder="Group name" handleChange={handleChange} name="name" autoComplete="off"/>
export default CreateGroup;