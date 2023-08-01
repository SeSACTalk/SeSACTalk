/* eslint-disable */
import React, { useState } from 'react';
import RestAPI from './routes/RestAPI';
import Login from './routes/login';
import logo from './logo.svg';
import './App.css';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom'


function App() {

  return (
    <div className="App">
      <Link to='/login'>로그인</Link>
      <Routes>
        <Route path='/login' element={<Login/>}/>
      </Routes>
      <RestAPI></RestAPI>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Button</button>
    </div>
  );
}

export default App;
