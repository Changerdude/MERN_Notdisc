import React from 'react'
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client'
import useAuth from '../hooks/useAuth';
import useUserList from '../hooks/useUserList';
import Sidebar from '../components/Sidebar';

const Main = () => {
  const nav = useNavigate();
  const { auth } = useAuth();
  const { userList, setUserList } = useUserList();
  const [test, setTest] = useState('main')
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState([{ room: 'main', chat: [] }]);
  const [socket, setSocket] = useState();

  useEffect(() => {
    setSocket(io('http://localhost:5000', { query: { username: auth.username } }));
  }, [])


  const handleSubmit = (e) => {
    e.preventDefault();
    socket && socket.emit('message-toServ', { message, sender: auth.username, room: test })
  }

  const logout = () => {
    axios.get(`http://localhost:8000/api/users/logout`)
    .then((res) => {
      socket.disconnect();
      nav('/login', {replace:true});
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
    console.log("Should update user list")
    setUserList(data);
  })

  return (
    <Container className='w-75 p-4 d-flex' style={{height:"75vh"}}>
      <Sidebar userList={userList} logout={logout}/>
      <div className='flex-grow-1 d-flex flex-column justify-content-between'>
        <ul className='flex-grow-1'>
          {conversations && conversations.map((conversation, i) => {
            return (
              <>
                <h2 key={i}>{conversation?.room}</h2>
                {
                  conversation?.chat.map((message, i) => {
                    return (
                      <li key={i}>{message}</li>
                    )
                  })
                }
              </>
            )
          })}
        </ul>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='sendMessage'>
            <Form.Control type='text' onChange={(e) => setTest(e.target.value)} value={test} />
            <Form.Label>Message:</Form.Label>
            <InputGroup>
              <Form.Control type='text' onChange={(e) => setMessage(e.target.value)} value={message} />
              <Button variant='primary' type='submit'>Send</Button>
            </InputGroup>
          </Form.Group>
        </Form>
      </div>
    </Container>
  )
}

export default Main;