/* eslint-disable */
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './style.css'
import './firebase-messaging-sw'

/* Components */
import Accounts from './routes/accounts/Accounts';
import Login from './routes/accounts/Login';
import Main from './routes/common/main/Main';
import Posts from './routes/common/main/Posts';
import PostDetail from './routes/common/post/PostDetail';
import ExploreResult from './routes/general/ExploreResult';
import Chat from './routes/common/chat/Chat'
import ChatDetail from './routes/common/chat/ChatDetail';
import Admin from './routes/admin/Admin';
import UserList from './routes/admin/UserList';
import UserInfo from './routes/admin/UserInfo';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* 계정관련 */}
        <Route path='/accounts' element={<Accounts />}>
          <Route path='login' element={<Login />} />
        </Route>
        {/* 일반 사용자 */}
        <Route path='/' element={<Main />}>
          <Route index element={<Posts />} />
          <Route path='post/:uuid' element={<PostDetail />} />
          <Route path='explore/:tagName' element={<ExploreResult />} />
          <Route path='chat' element={<Chat />}>
            <Route path=':chatRoom' element={<ChatDetail />} />
          </Route>
        </Route>
        {/* 관리자 */}
        <Route path='/admin' element={<Admin />}>
          <Route path='user' element={<UserList />} />
          <Route path='auth/user' element={<UserInfo />} />
          <Route path='chat' element={<Chat />} >
            <Route path=':chatRoom' element={<ChatDetail />} />
          </Route>
        </Route>
        <Route path='*' element={<div>없는 페이지에요</div>}></Route>
      </Routes>
    </div >
  )
}

export default App;