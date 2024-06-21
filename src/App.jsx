import {useContext } from 'react'
import Chat from './Chat';
import Login from './Login';
import { Context } from './context';

function App() {
  const {state: {username}} = useContext(Context);
  let content = username ? 
  <Chat /> : 
  <Login />

  return (
    <>
      {content}
    </>
  )
}


export default App
