import React, { useState, useRef } from 'react'
import axios from 'axios';
import CryptoJS from 'crypto-js'


import { setCookie } from '../../modules/handle_cookie';
// 임시
import { Link } from 'react-router-dom'

const Login = function () {
    // states
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    // DOM
    const idAlert = useRef();
    const pwAlert = useRef();

    /**
     * 아이디 유효성 검사 함수(영문/숫자, 특수문자 불가, 8~20글자)
     * @param {String} text 
     */
    const idValidator = (text) => {
        if (text.length === 0) {
            idAlert.current.innerHTML = '아이디를 입력해주세요'
        }

        if (text.length > 20) {
            idAlert.current.innerHTML = '아이디의 길이는 20자를 초과할 수 없습니다.'
            return false
        }
        if (/[ㄱ-ㅎ가-힣]/.test(text)) {
            idAlert.current.innerHTML = '아이디에 한글을 사용할 수 없습니다.'
            return false
        }
        if (/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g.test(text)) {
            idAlert.current.innerHTML = '아이디에 특수문자를 사용할 수 없습니다.';
            return false
        }
        return true
    }

    /**
     * 비밀번호 유효성 검사 함수(영문/숫자/특수문자, 8~20자)
     * @param {String} text 
     */
    const pwValidator = (text) => {
        let regex = /^[a-zA-Z\d`~!@#$%^&*-_=+]{8,20}$/
        if (regex.test(text)) {
            return true
        } else {
            pwAlert.current.innerHTML = '비밀번호를 올바르게 입력해주세요.'
            return false
        }
    }

    /**
  * 로그인 함수
  * @param {Event} e 
  */
    const handleLogin = async (e) => {
        e.preventDefault();
        if (idValidator(username) && pwValidator(password)) {
            const hashedPw = CryptoJS.SHA256(password).toString()
            try {
                const response = await axios.post('/accounts/login/', { username, hashedPw })
                // cookie 저장
                setCookie('session_key', response.data.session_key, 60);
                setCookie('username', response.data.username, 60);

                window.location.href = '/';
            } catch (error) {
                alert(error.response.data.error)
            }
        }
    }

    return (
        <div className='w-screen h-screen flex flex-col items-center place-content-center gap-5'>
            <div className='w-2/5 p-[2rem] border-2'>
                <div className='flex items-center place-content-center mb-10'>
                    <div className='w-10'>
                        <img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt='새싹톡' />
                    </div>
                    <div className='font-bold text-lg'>
                        <span>SeSAC Talk</span>
                    </div>
                </div>

                <form className='container mx-auto' onSubmit={handleLogin}>
                    <div>
                        <div>
                            <input type='text' name='username' id='username' placeholder='아이디' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={username} onChange={(e) => {
                                idAlert.current.innerHTML = '';
                                setUsername(e.target.value);
                            }} ></input>
                            <span className='block h-6 text-xs text-red-500' ref={idAlert} ></span>
                        </div>
                        <div>
                            <input type='password' name='password' id='password' placeholder='비밀번호' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={password} onChange={(e) => {
                                pwAlert.current.innerHTML = '';
                                setPassword(e.target.value);
                            }} ></input>
                            <span className='block h-6 text-xs text-red-500' ref={pwAlert}></span>
                        </div>
                        <button type='submit' className='w-full text-white bg-sesac-green hover:bg-sesac-dark-green focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>로그인</button>
                    </div>
                </form>
            </div>

            <div className='w-2/5 p-[2rem] border-2'>
                <div className='grid grid-cols-2 justify-items-center'>
                    <div>계정이 없으신가요?</div>
                    <div>
                        <Link to="/accounts/signup" className='text-sesac-green cursor-pointer'>가입하기</Link>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default Login