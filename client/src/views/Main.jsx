import React from 'react'
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client'
import useAuth from '../hooks/useAuth';
import useUserList from '../hooks/useUserList';
import Sidebar from '../components/Sidebar';
import ChatRoom from '../components/ChatRoom';

const Main = () => {
  const nav = useNavigate();
  const { auth } = useAuth();
  const { userList, setUserList } = useUserList();
  const [activeKey,setActiveKey] = useState('Main');
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState([{ room: 'Main', chat: [] }]);
  const [socket, setSocket] = useState();

  useEffect(() => {
    setSocket(io('http://localhost:5000', { query: { username: auth.username } }));
  }, [])


  const handleSubmit = (e) => {
    e.preventDefault();
    const conv = [...conversations];
    const i = conv.findIndex((element) => element.room === activeKey);
    conv[i].chat.push(`You: ${message}`);
    setConversations(conv)
    socket && socket.emit('message-toServ', { message, sender: auth.username, room: activeKey })
  }

  const selectUser = (user) => {
    if(user !== auth.username){
      const conv = [...conversations];
      const i = conv.findIndex((element) => element.room === user);
      if (i < 0) {
        conv.push({ room: user, chat: [] });
        setConversations(conv)
      }
      setActiveKey(user);
    }
  }

  const logout = () => {
    axios.get(`http://localhost:8000/api/users/logout`)
      .then((res) => {
        socket.disconnect();
        nav('/login', { replace: true });
      })
      .catch((err) => {
        console.log(err);
      })
  }


  socket && socket.on("message-toClient", data => {
    const conv = [...conversations];
    const i = conv.findIndex((element) => element.room === data.room);
    if (i > -1) {
      conv[i] = {
        room: conv[i].room,
        chat: [...conv[i].chat, `${data?.sender}: ${data?.message}`]
      }
    } else {
      conv.push({ room: data?.room, chat: [`${data?.sender}: ${data?.message}`] });
    }
    setConversations(conv)
  })

  socket && socket.on("current-user-list", data => {
    setUserList(data);
  })

  return (
    <div className='w-75 mx-auto my-4 d-flex theme-dk-grey' style={{ height: "75vh", minWidth:"500px" }}>
      <Sidebar userList={userList} logout={logout} selectUser={selectUser} />
      <div className='flex-grow-1 d-flex flex-column justify-content-between'>
        <Tab.Container className='theme-ly-grey' activeKey={activeKey} onSelect={setActiveKey}>
          <Nav variant='tabs' className='theme-lt-grey'>
            <Nav.Item className='d-flex flex-wrap align-items-start'>
              {conversations && conversations.map((conversation, i) => {
                return (
                  <Nav.Link className='rounded-0 theme-dk-grey' key={i} eventKey={conversation.room}>
                    {conversation.room}
                  </Nav.Link>
                )
              })}
            </Nav.Item>
          </Nav>
          <Tab.Content className='flex-grow-1 p-3 overflow-auto'>
          {conversations && conversations.map((conversation, i) => {
            return(
              <Tab.Pane className='h-100' eventKey={conversation.room}>
                <ChatRoom chat={conversation.chat}/>
              </Tab.Pane>
              )
          })}

          </Tab.Content>
        </Tab.Container>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='sendMessage'>
            <InputGroup>
              <Form.Control className='rounded-0 theme-lt-grey' type='text' onChange={(e) => setMessage(e.target.value)} value={message} />
              <Button className='rounded-0 theme-orange' type='submit'>Send</Button>
            </InputGroup>
          </Form.Group>
        </Form>
      </div>
    </div>
  )
}

export default Main;