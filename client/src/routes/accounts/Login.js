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

    //! 특수문자 유효성만 남기고 레이아웃 수정하기
    /**
     * 아이디 유효성 검사 함수(영문/숫자, 특수문자 불가, 8~20글자)
     * @param {String} text 
     * @returns {bool}
     */
    const idValidator = (text) => {
        if (text.length === 0) {
            idAlert.current.innerHTML = '아이디를 입력해주세요'
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
     * @returns {bool} 
     */
    const pwValidator = (text) => {
        let regex = /^[a-zA-Z\d`~!@#$%^&*-_=]+$/
        if (text.length === 0) {
            pwAlert.current.innerHTML = '비밀번호를 입력해주세요'
        }

        if (regex.test(text)) {
            return true
        }
        return false
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
                //TODO INVALID CREDENTIALS: 지워지게
                alert(error.response.data.error)
            }
        }
    }

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <div className='flex justify-center items-center w-3/4 h-3/5'>
                <div className='h-5/6 overflow-hidden'>
                    <img src={`${process.env.PUBLIC_URL}/img/intro.gif`} alt='새싹이' />
                </div>
                <div className='flex flex-col justify-center gap-5 w-2/5 h-full'>
                    <div className='border p-5'>
                        <div className='flex items-center place-content-center mb-10'>
                            <div className='w-10'>
                                <img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt='새싹톡' />
                            </div>
                            <h1 className='font-bold text-lg'>SeSAC Talk</h1>
                        </div>
                        <h2 className='hidden'>로그인</h2>
                        <form className='container mx-auto' onSubmit={handleLogin}>
                            <div>
                                <div>
                                    <input className='block w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm' type='text' name='username' id='username' placeholder='아이디' maxLength="20" value={username} onChange={(e) => {
                                        idAlert.current.innerHTML = '';
                                        setUsername(e.target.value);
                                    }} ></input>
                                    <span className='block h-6 pl-2 text-xs text-red-500' ref={idAlert}></span>
                                </div>
                                <div>
                                    <input className='block w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm' type='password' name='password' id='password' placeholder='비밀번호' maxLength="20" value={password} onChange={(e) => {
                                        pwAlert.current.innerHTML = '';
                                        setPassword(e.target.value);
                                    }} ></input>
                                    <span className='block h-6 pl-2 text-xs text-red-500' ref={pwAlert}></span>
                                </div>
                                <button className='w-full h-10 text-white bg-sesac-sub2 rounded-lg text-sm hover:bg-sesac-dark-green hover:transition-colors' type='submit'>로그인</button>
                                <h3 className='hidden'>아이디/비밀번호 찾기</h3>
                                <ul className='flex justify-center mt-5 text-sesac-sub2 text-sm'>
                                    <li className='after:content-["|"] after:mx-1'>
                                        <Link to="/account/find/id">아이디 찾기</Link>
                                    </li>
                                    <li>
                                        <Link to="/account/password/reset">비밀번호 찾기</Link>
                                    </li>
                                </ul>
                            </div>
                        </form>
                    </div>
                    <div className='flex justify-evenly border p-5 text-base'>
                        <span>계정이 없으신가요?</span>
                        <Link to="/account/signup" className='font-semibold text-sesac-green cursor-pointer'>가입하기</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login