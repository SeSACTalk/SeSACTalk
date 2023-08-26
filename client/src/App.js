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
import Main from './routes/general/Main'
import Admin from './routes/admin/Admin.js';

import {Posts} from './routes/common/post/Posts';
import WritePost from './routes/common/post/WritePost';
import AdminAuthedUser from './routes/admin/UserList';
import AdminUserDetail from './routes/admin/UserDeatil';
import NotifyReport from './routes/admin/NotifyReport';

function App() {
  return (
    <div className="App">
      <Link to='/accounts'>accounts</Link>&nbsp;|&nbsp;
      <Link to='/general'>general</Link>&nbsp;|&nbsp;
      <Link to='/admin'>admin</Link>&nbsp;|&nbsp;
      <Link to='/chat'>채팅</Link>
      <Routes>
        {/* Root routes */}
        <Route path='/admin' element={<Admin />} />
        <Route path='/general' element={<General />} />
        <Route path='/' element={<Main />} />
        <Route path='/chat' element={<Chat />}>
          <Route path=':username' element={<ChatDetail />}></Route>
        </Route>

        {/* /routes/accounts/ */}
        <Route path='/accounts' element={<Accounts />} >
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<SignUp />} />
          <Route path='find'>
            <Route path='user/id' element={<FindId />} />
            <Route path='user/password' element={<FindPassword />} />
          </Route>
        </Route>
        
        {/* /routes/posts/ */}
        <Route path='/post/:username' element={<Posts/>} ></Route>
        <Route path='/post/:username/write' element={<WritePost />}></Route>       
        
        {/* /routes/admin/ */}
        <Route path='/admin' element={<Admin />}>
          <Route path = 'notify/report'element={<NotifyReport/>}/>
          <Route path='user' element={<AdminAuthedUser />} >
            <Route path=':id' element={<AdminUserDetail />}></Route>
          </Route>
          <Route path='auth/user' element={<AdminUserInfo />} />
        </Route>
      </Routes>
    </div >
  );
}

export default App;