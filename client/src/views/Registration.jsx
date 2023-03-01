import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [pw, setPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMatch, setPwMatch] = useState(false);
  const { errs, setErrs } = useState([]);

  useEffect(() => {
    const match = pw === confirmPw;
    setPwMatch(match);
  }, [pw, confirmPw])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pwMatch) {
      axios.post(`http://localhost:8000/api/users/create`, {})
        .then((res) => {

        })
        .catch((err) => {

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
            <Form.Control type='text' onChange={(e) => setEmail(e.target.value)} value={email} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Username(This is what people will see your name as):</Form.Label>
            <Form.Control type='text' onChange={(e) => setUsername(e.target.value)} value={username} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password:</Form.Label>
            <Form.Control type='password' onChange={(e) => setPw(e.target.value)} value={pw} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control type='password' onChange={(e) => setConfirmPw(e.target.value)} value={confirmPw} />
          </Form.Group>
          <Button type='submit'>Create User</Button>
        </Form>
        <Link to='/login'>Already have an account?</Link>
      </Container>
    </>
  )
}

export default Registration;