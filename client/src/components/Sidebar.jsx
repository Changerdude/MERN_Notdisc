import React from 'react'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import useUserList from '../hooks/useUserList';
import { useNavigate } from 'react-router-dom';

const Sidebar = props => {
    const { userList, selectUser , logout } = props;
    const nav = useNavigate();




    return (
        <Container className='w-25 d-flex flex-column justify-content-between' style={{minWidth:'150px'}}>
            <div className='mb-3 d-flex align-items-center'>
                <img src="icon.png" alt="logo" height={'50px'} width={'50px'} className=''/>
                <div className='fs-4 mx-auto'>Notdisc</div>
            </div>
            <div className='p-2 flex-grow-1'>
                {userList.map((user,i) => {
                    return (
                        <p key={i} onClick={() => selectUser(user)}>{user}</p>
                    )
                })}
            </div>
            <Button onClick={() => logout()}>Logout</Button>

        </Container>
    )
}

export default Sidebar;