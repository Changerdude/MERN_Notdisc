import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client'
import './App.css';

function App() {
  const [message, setMessage] = useState("");
  const [test, setTest] = useState("main");
  const [chat, setChat] = useState([]);
  const [socket,setSocket] = useState();

  useEffect(() =>{
    setSocket(io('http://localhost:5000'));
  },[])


  const handleSubmit = (e) => {
    e.preventDefault();
    socket && socket.emit('message-toServ', {message, sender:socket.id, recipent: test})
  }

  socket && socket.on("message-toClient", data =>{
    setChat([...chat,`${data.sender}: ${data.message}`])
  })

  return (
    <Container className='w-50'>
      <ul>
        {chat && chat.map((message, i) => {
          return (
            <li key={i}>{message}</li>
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
    </Container>
  );
}

export default App;
