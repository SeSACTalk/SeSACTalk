/* eslint-disable */
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'

import './style.css'
import './firebase-messaging-sw'

import { checkAuthMiddleware, checkInfoMiddleware } from './middleware/middleware';
/* Components */
import Main from './routes/common/main/Main'
import Login from './routes/accounts/Login';
import Admin from './routes/admin/Admin';
import { ProfileLayout, Profile, EditProfile, ExProfile, ExProfileEdit } from './routes/common/profiles/Profile';

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
        <Route path='/' element={<Main />}></Route>
        {/* 관리자 */}
        <Route path='/admin' element={<Admin />}></Route>
        {/* 프로필 */}
        <Route path="/profile/:username" element={<ProfileLayout />} >
          {/* <Route path="" element={<Profile/>} />
          <Route path="edit" element={<EditProfile/>} /> */}
          <Route path="" element={<ExProfile/>} />
          <Route path="edit" element={<ExProfileEdit/>} />
        </Route>
      </Routes>
    </div >
  )
}

export default App;