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
import Admin from './routes/admin/admin';
import AdminUserInfo from './routes/admin/UserInfo';



function App() {
  return (
    <div className="App">
      <Link to='/accounts/login'>로그인</Link>
      <Link to='/accounts/signup'>회원가입</Link>
      <Link to='/accounts/find/user/id/'>아이디 찾기</Link>
      <Link to='/accounts/find/user/password/'>비밀번호 찾기</Link>
      <Link to='/admin/'>관리자</Link>
      <Routes>
        <Route path='/accounts/login' element={<Login />} />
        <Route path='/accounts/signup' element={<SignUp />} />
        <Route path='/accounts/find/user/id/' element={<FindId />} />
        <Route path='/accounts/find/user/password' element={<FindPassword />} />
        <Route path='/admin' element={<Admin />}>
          <Route path='auth/user' element={<AdminUserInfo />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
