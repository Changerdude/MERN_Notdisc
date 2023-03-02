import { useContext } from 'react';
import UserListContext from '../context/UserListProvider';

const useUserList = () => {
    return useContext(UserListContext);
}

export default useUserList;