/* eslint-disable */
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'

import './style.css'
import './firebase-messaging-sw'

import { checkAuthMiddleware } from './middleware/middleware';
/* Components */
import Login from './routes/accounts/Login';
import Main from './routes/common/main/Main';
import Posts from './routes/common/main/Posts';
import PostDetail from './routes/common/post/PostDetail';
import ExploreResult from './routes/general/ExploreResult';
import Admin from './routes/admin/Admin';
import Chat from './routes/common/chat/Chat'
import ChatDetail from './routes/common/chat/ChatDetail';

function App() {
  let navigate = useNavigate()

  // useEffect(() => {
  //   checkAuthMiddleware()
  //     .then(() => {
     
  //     })
  //     .catch(() => {
  //       navigate('/accounts/login');
  //     });
  // }, []);

  return (
    <div className="App">
      <Routes>
        {/* 계정관련 */}
        <Route path='/accounts/login' element={<Login />}></Route>
        {/* 일반 사용자 */}
        <Route path='/' element={<Main />}>
          <Route index element={<Posts />} />
          <Route path='explore/:tagName' element={<ExploreResult />} />
          <Route path='post/:uuid' element={<PostDetail />} />
        </Route>
        <Route path='/chat' element={<Chat />}>
          <Route path=':chatRoom' element={<ChatDetail />} />
        </Route>
        {/* 관리자 */}
        <Route path='/admin' element={<Admin />}></Route>
        <Route path='*' element={<div>없는 페이지에요</div>}></Route>
      </Routes>

    </div >
  )
}

export default App;