import React from 'react'
import Button from 'react-bootstrap/Button'
import useAuth from '../hooks/useAuth';

const Sidebar = props => {
    const { userList, selectUser , logout } = props;
    const { auth } = useAuth();




    return (
        <div className='w-25 d-flex flex-column justify-content-between theme-lt-grey' style={{minWidth:'150px'}}>
            <div className='mb-1 d-flex align-items-center theme-lt-grey'>
                <img src="icon.png" alt="logo" height={'50px'} width={'50px'} className=''/>
                <div className='fs-4 mx-auto'>Notdisc</div>
            </div>
            <div className='px-2 flex-grow-1 overflow-auto'>
                {userList.map((user,i) => {
                    return (
                        <p className={`${user === auth.username && 'theme-orange'} m-1`} key={i} onClick={() => selectUser(user)}>{user === auth.username ? `You(${user})` : user}</p>
                    )
                })}
            </div>
            <Button className='rounded-0 theme-orange' onClick={() => logout()}>Logout</Button>

        </div>
    )
}

export default Sidebar;