/* eslint-disable */
import React from 'react';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';

import './App.css';
import './style.css'
import './firebase-messaging-sw'

import Login from './routes/accounts/Login';
import SignUp from './routes/accounts/Signup';
import FindId from './routes/accounts/FindId';
import FindPassword from './routes/accounts/FindPassword';
import AdminUserInfo from './routes/admin/UserInfo';
import Chat from './routes/common/chat/Chat'
import ChatDetail from './routes/common/chat/ChatDetail';


import Accounts from './routes/accounts/Accounts';
import General from './routes/general/General'
import Admin from './routes/admin/Admin.js';

import Posts from './routes/common/post/Posts';
import WritePost from './routes/common/post/WritePost';


function App() {
  return (
    <div className="App">
      <Link to='/accounts'>accounts</Link>&nbsp;|&nbsp;
      <Link to='/general'>general</Link>&nbsp;|&nbsp;
      <Link to='/admin'>admin</Link>
      <Link to='/chat/'>채팅</Link>
      <Routes>
        {/* Root routes */}
        <Route path='/accounts' element={<Accounts />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/general' element={<General />} />
        <Route path='/chat' element={<Chat />}>
          <Route path=':username' element={<ChatDetail />}></Route>
        </Route>

        {/* /routes/accounts/ */}
        <Route path='/accounts/login' element={<Login />} />
        <Route path='/accounts/signup' element={<SignUp />} />
        <Route path='/accounts/find/user/id/' element={<FindId />} />
        <Route path='/accounts/find/user/password' element={<FindPassword />} />

        {/* /routes/admin/ */}
        <Route path='/admin' element={<Admin />}>
          <Route path='auth/user' element={<AdminUserInfo />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;