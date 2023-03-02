import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormRange from 'react-bootstrap/esm/FormRange';

const Registration = () => {
  const { setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [pw, setPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMatch, setPwMatch] = useState(false);
  const [error,setErrors] =useState(false);

  const EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$');

  const nav = useNavigate();

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
    <>
      <Container>
        <Form onSubmit={handleSubmit} className='needs-validation' noValidate>
          <Form.Group>
            <Form.Label>Email:</Form.Label>
            <Form.Control type='text' onChange={(e) => setEmail(e.target.value)} value={email} required isInvalid={!EMAIL_REGEX.test(email)}/>
            <Form.Control.Feedback type='invalid'>
              Must be a valid email
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Username(This is what people will see your name as):</Form.Label>
            <Form.Control type='text' onChange={(e) => setUsername(e.target.value)} value={username} required isInvalid={error?.username}/>
            <Form.Control.Feedback type='invalid'>
              {error.username?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Password:</Form.Label>
            <Form.Control type='password' onChange={(e) => setPw(e.target.value)} value={pw} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control type='password' onChange={(e) => setConfirmPw(e.target.value)} value={confirmPw} required isInvalid={!pwMatch} />
            <Form.Control.Feedback type='invalid'>
              Passwords must match
            </Form.Control.Feedback>
          </Form.Group>
          <Button type='submit'>Create User</Button>
        </Form>
        <Link to='/login'>Already have an account?</Link>
      </Container>
    </>
  )
}

export default Registration;