import React from 'react'
import { useCallback } from 'react';

const ChatRoom = props => {
    const { chat } = props;
    const setRef = useCallback((ref) =>{
        ref && ref.scrollIntoView({smooth:true})
    },[])


    return (
        <div className='d-flex flex-column flex-grow-1'>
                <div className='d-flex flex-column align-items-start justify-content-end'>
                    {chat.map((message,i) => {
                        const lastMessage = chat.length - 1 === i;
                        return(
                            <div 
                            key={i} 
                            className={`my-1 px-2 py-1 ${message.slice(0,5) === "You: " ? 'theme-orange align-self-end': 'theme-lt-grey' }`}
                            ref={lastMessage ? setRef : null}>
                                {message}
                            </div>
                        )
                    })}
                </div>
        </div>
    )
}

export default ChatRoom