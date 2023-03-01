import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';


const Login = () => {
  const nav = useNavigate();
  const { setAuth } = useAuth();
  const [email,setEmail] = useState('');
  const [pw,setPw] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:8000/api/users/login`, { email, pw } , {withCredentials:true})
    .then((res) => {
      setAuth({username: res?.data?.username , accessToken: res?.data?.accessToken});
      nav('/main')
    })
    .catch((err) => {
      alert("Login Failed")
    })
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
            <Form.Label>Password:</Form.Label>
            <Form.Control type='password' onChange={(e) => setPw(e.target.value)} value={pw} required/>
          </Form.Group>
          <Button type='submit'>Sign In</Button>
        </Form>
        <Link to='/create'>Need an account?</Link>
      </Container>
    </>
  )
}

export default Login;