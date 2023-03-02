import { createContext, useState } from "react";

const UserListContext = createContext({})

export const UserListProvider = ({ children }) => {
    const [userList,setUserList] = useState([]);

    return (
        <UserListContext.Provider value={{userList,setUserList}}>
            { children }
        </UserListContext.Provider>
    )
}

export default UserListContext;