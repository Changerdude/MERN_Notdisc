import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Registration = () => {
  const { auth,setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [pw, setPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMatch, setPwMatch] = useState(false);
  const [error,setErrors] =useState(false);

  const EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$');

  const nav = useNavigate();

  useEffect(() => {
    if(auth.username) nav('/main',{replace:true})
  },[])

  useEffect(() => {
    const match = pw === confirmPw;
    setPwMatch(match);
  }, [pw, confirmPw])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pwMatch && EMAIL_REGEX.test(email)) {
      axios.post(`http://localhost:8000/api/users/create`, {
        email,
        username,
        pw
      }, { withCredentials: true })
        .then((res) => {
          setAuth({ username: res?.data?.username, accessToken: res?.data?.accessToken });
          nav('/main')
        })
        .catch((err) => {
          setErrors(err.responce?.data?.error?.errors)
        })
    }
  }

  return (
    <div className='d-flex align-items-center justify-content-center' style={{height:'100vh'}}>
      <Container className="theme-lt-grey" style={{width:'340px'}}>
        <h1 className='mb-4 text-center'>Sign Up</h1>
        <Form onSubmit={handleSubmit} className='needs-validation m-auto' noValidate>
          <Form.Group className='mb-3'>
            <Form.Label>Email:</Form.Label>
            <Form.Control className='theme-dk-grey' type='text' onChange={(e) => setEmail(e.target.value)} value={email} required isInvalid={!EMAIL_REGEX.test(email)}/>
            <Form.Control.Feedback type='invalid'>
              Must be a valid email
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Username(This is what people will see your name as):</Form.Label>
            <Form.Control className='theme-dk-grey' type='text' onChange={(e) => setUsername(e.target.value)} value={username} required isInvalid={error?.username}/>
            <Form.Control.Feedback type='invalid'>
              {error.username?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Password:</Form.Label>
            <Form.Control className='theme-dk-grey' type='password' onChange={(e) => setPw(e.target.value)} value={pw} required />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control className='theme-dk-grey' type='password' onChange={(e) => setConfirmPw(e.target.value)} value={confirmPw} required isInvalid={!pwMatch} />
            <Form.Control.Feedback type='invalid'>
              Passwords must match
            </Form.Control.Feedback>
          </Form.Group>
          <Button className='theme-orange' type='submit'>Create User</Button>
        </Form>
        <Link to='/login' className='mb-2'>Already have an account?</Link>
      </Container>
    </div>
  )
}

export default Registration;