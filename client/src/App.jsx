import RequireAuth from './components/RequireAuth';
import { UserListProvider } from './context/UserListProvider';
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './views/Login';
import Main from './views/Main';
import Registration from './views/Registration';

function App() {

  return (
    <div>
      <UserListProvider>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/create' element={<Registration />} />
          <Route element={<RequireAuth />}>
            <Route path='/main' element={<Main />} />
          </Route>
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </UserListProvider>
    </div>
  );
}

export default App;
