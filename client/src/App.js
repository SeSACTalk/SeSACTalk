/* eslint-disable */
import React, { useState } from 'react';
import RestAPI from './RestAPI';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://127.0.0.1:8000/login/', {username, password})
      console.log('Login success!', response.data);
    } catch (error) {
      console.error('Login failed', error.response)
    }
  }

  return (
    <div className="App">
      <form onSubmit={handleLogin}>
        <div className='grid gap-6 mb-6 md:grid-cols-2'>
          <div>
            <label htmlFor='username' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>아이디</label>
            <input type='text' name='username' id='username' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={username} onChange={(e) => setUsername(e.target.value)} ></input>
          </div>
          <div>
            <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>비밀번호</label>
            <input type='password' name='password' id='password' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={password} onChange={(e) => setPassword(e.target.value)} ></input>
          </div>
        </div>
        <button type='submit' className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>로그인</button>
      </form>
      <RestAPI></RestAPI>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Button</button>
    </div>
  );
}

export default App;
