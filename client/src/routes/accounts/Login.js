import React, { useState } from 'react'
import axios from 'axios';
import CryptoJS from 'crypto-js'
import { useDispatch } from 'react-redux';
import { changeUser } from '../../store/userSlice';

import { useNavigate } from 'react-router-dom'
import { setCookie } from '../../modules/handle_cookie';
// 임시
import { Link } from 'react-router-dom'

const SERVER = process.env.REACT_APP_BACK_BASE_URL
const SERVER_ACCOUNTS_LOGIN = `${SERVER}/accounts/login/`

const Login = function () {
    const navigate = useNavigate()

    let dispatch = useDispatch();

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()
        const hashedPw = CryptoJS.SHA256(password).toString()

        try {
            const response = await axios.post(SERVER_ACCOUNTS_LOGIN, { username, hashedPw })
            // cookie 저장
            setCookie('session_key', response.data.session_key, 60)
            setCookie('username', response.data.username, 60)

            // 사용자명 저장
            dispatch(changeUser(response.data.username))

            navigate('/')
        } catch (error) {
            console.error('Login failed', error.response)
        }
    }

    return (
        <form className='container mx-auto' onSubmit={handleLogin}>
            <Link to='/accounts/signup'>회원가입</Link>
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
    )
}

export default Login