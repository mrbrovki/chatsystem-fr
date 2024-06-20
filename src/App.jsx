/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import Chat from './Chat';
import Login from './Login';

function App() {
  const [username, setUsername] = useState();
  
  let content = username ? 
  <Chat
    username={username} setUsername={setUsername}/> : 
  <Login 
    setUsername={setUsername} />

  return (
    <>
      {content}
    </>
  )
}

export default App
