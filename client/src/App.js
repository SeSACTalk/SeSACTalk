/* eslint-disable */
import React from 'react';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';

import './App.css';
import './style.css'
import Login from './routes/accounts/Login';
import SignUp from './routes/accounts/Signup';
import FindId from './routes/accounts/FindId';
import FindPassword from './routes/accounts/FindPassword';
import Profile from './routes/profiles/Profile'
import './firebase-messaging-sw'

import { getCookie } from './modules/handle_cookie';

function App() {
  const username = getCookie("username");

  return (
    <div className="App">
      <Link to='/accounts/login'>로그인</Link>
      <Link to='/accounts/signup'>회원가입</Link>
      <Link to='/accounts/find/user/id/'>아이디 찾기</Link>
      <Link to='/accounts/find/user/password/'>비밀번호 찾기</Link>
      <Routes>
        <Route path='/accounts/login' element={<Login/>}/>
        <Route path='/accounts/signup' element={<SignUp/>}/>
        <Route path='/accounts/find/user/id/' element={<FindId/>}/>
        <Route path='/accounts/find/user/password' element={<FindPassword/>}/>

        <Route path='/profile/:username' element={<Profile/>}/>
      </Routes>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Button</button>

      <Link to={`/profile/${username}`}>프로필 조회</Link>
    </div>
  );
}

export default App;
