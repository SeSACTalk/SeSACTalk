/* eslint-disable */
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'

import './style.css'
import './firebase-messaging-sw'

import { checkAuthMiddleware, checkInfoMiddleware } from './middleware/middleware';
import Main from './routes/common/main/Main'
import Login from './routes/accounts/Login';
import Admin from './routes/admin/Admin';

import { Profile, EditProfile } from './routes/profiles/Profile'
import { Replys, Reply } from './routes/post/Reply';


function App() {
  let navigate = useNavigate()

  useEffect(() => {
    checkAuthMiddleware()
      .then(() => {
        checkInfoMiddleware()
          .then(() => {
            navigate('/admin')
          })
          .catch(() => {
            console.log('어드민 페이지이므로 접근이 불가합니다.\n/general로 이동')
            navigate('/')
          })
      })
      .catch(() => {
        navigate('/accounts/login');
      });
  }, []);

  return (
    <div className="App">
      <Routes>
        {/* 계정관련 */}
        <Route path='/accounts/login' element={<Login />}></Route>
        {/* 일반 사용자 */}
        <Route path='/' element={<Main />}>

        </Route>

        <Route path='/profile/:username' element={<Profile />} >
          <Route path='edit' element={<EditProfile />} />
        </Route>
        {/* 관리자 */}
        <Route path='/admin' element={<Admin />}></Route>
      </Routes>


    </div >
  );
}

export default App;