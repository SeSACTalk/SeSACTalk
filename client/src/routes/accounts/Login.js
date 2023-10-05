import React, { useState, useEffect } from 'react'
import axios from 'axios';
import CryptoJS from 'crypto-js'


import { setCookie } from '../../modules/handle_cookie';

const SERVER = process.env.REACT_APP_BACK_BASE_URL

const Login = function () {
    // states
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault()
        const hashedPw = CryptoJS.SHA256(password).toString()

        try {
            const response = await axios.post('/accounts/login/', { username, hashedPw })
            // cookie 저장
            setCookie('session_key', response.data.session_key, 60);
            setCookie('username', response.data.username, 60);

            window.location.href = '/';
        } catch (error) {
            console.error('Login failed', error.response)
        }
    }
    const handleSignup = async (e) => {
        e.preventDefault()
    }

    return (
        <div className='w-screen h-screen flex flex-col items-center place-content-center gap-5'>
            <div className='w-2/5 p-[2rem] border-2'>
                <div className='flex items-center place-content-center mb-10'>
                    <div className='w-10'>
                        <img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt='새싹톡'/>
                    </div>
                    <div className='object-center font-bold'>
                        <span>SeSAC Talk Talk</span>
                    </div>
                </div>

                <form className='container mx-auto' onSubmit={handleLogin}>
                    <div className='flex flex-col gap-3'> {/*className='grid gap-6 mb-6 md:grid-cols-2'*/}
                        <div>
                            {/* <label htmlFor='username' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>아이디</label> */}
                            <input type='text' name='username' id='username' placeholder='아이디' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={username} onChange={(e) => setUsername(e.target.value)} ></input>
                        </div>
                        <div>
                            {/* <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>비밀번호</label> */}
                            <input type='password' name='password' id='password' placeholder='비밀번호' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={password} onChange={(e) => setPassword(e.target.value)} ></input>
                        </div>
                        <button type='submit' className='text-white bg-sesac-green hover:bg-sesac-dark-green focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>로그인</button>
                    </div>
                </form>
            </div>

            <div className='w-2/5 p-[2rem] border-2'>
                <div className='grid grid-cols-2 justify-items-center'>
                    <div>계정이 없으신가요?</div>
                    <div>
                        <a className='text-sesac-green cursor-pointer' onClick={handleSignup}>가입하기</a>
                    </div>
                </div>
            </div>
            
        </div>
        
    )
}

export default Login