/* eslint-disable */
import './App.css';
import './style.css'
import React from 'react';
import RestAPI from './routes/RestAPI';

import Login from './routes/accounts/Login';
import SignUp from './routes/accounts/Signup';
import FindId from './routes/accounts/FindId'
import FindPassword from './routes/accounts/FindPassword';

import Accounts from './routes/accounts/Accounts';
import Admin from './routes/admin/Admin';
import General from './routes/general/General'

import Posts from './routes/common/post/Posts';
import WritePost from './routes/common/post/WritePost';

import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Link to='/accounts'>accounts</Link>&nbsp;|&nbsp;
      <Link to='/general'>general</Link>&nbsp;|&nbsp;
      <Link to='/admin'>admin</Link>

      <Routes>
        {/* Root routes */}
        <Route path='/accounts' element={<Accounts/>}/>
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/general' element={<General/>}/>

        {/* /routes/accounts/ */}
        <Route path='/accounts/login' element={<Login/>}/>
        <Route path='/accounts/signup' element={<SignUp/>}/>
        <Route path='/accounts/find/user/id/' element={<FindId/>}/>
        <Route path='/accounts/find/user/password' element={<FindPassword/>}/>

        {/* /routes/common/ */}
        {/* /post/ */}
        <Route path='/post/:username' element={<Posts/>}/>
        <Route path='/post/:username/write' element={<WritePost/>}/>
      </Routes>
      <RestAPI></RestAPI>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Button</button>
    </div>
  );
}

export default App;