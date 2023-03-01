import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Registration = () => {
  const { setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [pw, setPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMatch, setPwMatch] = useState(false);
  const { errs, setErrs } = useState([]);

  const nav = useNavigate();

  useEffect(() => {
    const match = pw === confirmPw;
    setPwMatch(match);
  }, [pw, confirmPw])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pwMatch) {
      axios.post(`http://localhost:8000/api/users/create`, {
        email,
        username,
        pw
      },{withCredentials:true})
        .then((res) => {
          setAuth({username: res?.data?.username , accessToken: res?.data?.accessToken});
          nav('/main')
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      alert('Passwords need to match');
      //This will move to validations below
    }
  }

  return (
    <>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Email:</Form.Label>
            <Form.Control type='text' onChange={(e) => setEmail(e.target.value)} value={email} required/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Username(This is what people will see your name as):</Form.Label>
            <Form.Control type='text' onChange={(e) => setUsername(e.target.value)} value={username} required/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Password:</Form.Label>
            <Form.Control type='password' onChange={(e) => setPw(e.target.value)} value={pw} required/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control type='password' onChange={(e) => setConfirmPw(e.target.value)} value={confirmPw} required/>
          </Form.Group>
          <Button type='submit'>Create User</Button>
        </Form>
        <Link to='/login'>Already have an account?</Link>
      </Container>
    </>
  )
}

export default Registration;