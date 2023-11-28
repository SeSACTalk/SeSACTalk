import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './style.css'
// import './firebase-messaging-sw'

/* Components */
import Accounts from './routes/accounts/Accounts';
import Login from './routes/accounts/Login';
import Signup from './routes/accounts/Signup';
import FindId from './routes/accounts/FindId';
import PasswordReset from './routes/accounts/PasswordReset';
import Main from './routes/common/main/Main';
import Posts from './routes/common/main/Posts';
import PostDetail from './routes/common/post/PostDetail';
import ExploreResult from './routes/general/ExploreResult';
import Chat from './routes/common/chat/Chat'
import ChatDetail from './routes/common/chat/ChatDetail';
import Admin from './routes/admin/Admin';
import UserList from './routes/admin/UserList';
import UserVerify from './routes/admin/UserVerify';
import AdminNotice from './routes/admin/AdminNotice';
import CourseApproval from './routes/admin/CourseApproval';
import { ProfileLayout, Profile } from './routes/common/profile/Profile';
import EditProfile from './routes/common/profile/EditProfile';
import WithdrawModal from './routes/common/profile/WithdrawModal';
import NotFound from './routes/common/NotFound';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* 계정관련 */}
        <Route path='/account' element={<Accounts />}>
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
          <Route path='find/id' element={<FindId />} />
          <Route path='password/reset' element={<PasswordReset />} />
        </Route>
        {/* 일반 사용자 */}
        <Route path='/' element={<Main />}>
          <Route index element={<Posts />} />
          <Route path='post/:uuid' element={<PostDetail />} />
          <Route path='explore/:tagName' element={<ExploreResult />} />
          <Route path='chat' element={<Chat />}>
            <Route path=':chatRoom' element={<ChatDetail />} />
          </Route>
          <Route path='explore/:tagName' element={<ExploreResult />} />
          {/* 프로필 */}
          <Route path="profile/:username" element={<ProfileLayout />} >
            <Route path="" element={<Profile />}>
              <Route path="withdraw" element={<WithdrawModal />} />
            </Route>
            <Route path="edit" element={<EditProfile />} />
          </Route>
          {/* 관리자 */}
          <Route path='/admin' element={<Admin />}>
            <Route index element={<UserList />} />
            <Route path='user/course' element={<CourseApproval />} />
            <Route path='auth/user' element={<UserVerify />} />
            <Route path='user/notify' element={<AdminNotice/>} />
          </Route>
        </Route>
        <Route path='*' element={<NotFound />}></Route>
      </Routes>
    </div >
  )
}

export default App; 