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
    <div className='d-flex align-items-center justify-content-center' style={{height:'100vh'}}>
          <Container className='theme-lt-grey' style={{width:'340px'}}>
            <h1 className='mb-4 text-center'>Notdisc</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-4'>
            <Form.Label>Email:</Form.Label>
            <Form.Control className='theme-dk-grey' type='text' onChange={(e) => setEmail(e.target.value)} value={email} required/>
          </Form.Group>
          <Form.Group className='mb-4'>
            <Form.Label>Password:</Form.Label>
            <Form.Control className='theme-dk-grey' type='password' onChange={(e) => setPw(e.target.value)} value={pw} required/>
          </Form.Group>
          <Button className='theme-orange'type='submit'>Sign In</Button>
        </Form>
        <Link to='/create' className='mb-2'>Need an account?</Link>
      </Container>
    </div>
  )
}

export default Login;