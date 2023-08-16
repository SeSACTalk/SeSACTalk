/* eslint-disable */
import './App.css';
import './style.css'
import React from 'react';
import RestAPI from './routes/RestAPI';
import Login from './routes/accounts/Login';
import Signup from './routes/accounts/Signup';
import FindId from './routes/accounts/FindId';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Link to='/accounts/login'>로그인</Link>
      <Link to='/accounts/signup'>회원가입</Link>
      <Link to='/accounts/find/user/id/'>아이디 찾기</Link>
      <Routes>
        <Route path='/accounts/login' element={<Login />} />
        <Route path='/accounts/signup' element={<Signup />} />
        <Route path='/accounts/find/user/password' element={<Signp />} />
        <Route path='/accounts/find/user/id/' element={<FindId />} />
      </Routes>
      <RestAPI></RestAPI>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Button</button>
    </div>
  );
}

export default App;
