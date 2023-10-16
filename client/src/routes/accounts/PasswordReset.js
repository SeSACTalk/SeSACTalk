import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'


const PasswordReset = function () {
    let navigate = useNavigate()

    // states
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    /**
     * 비밀번호 찾기 요청 함수
     * @param {Event} e 
     */
    const findPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/accounts/find/user/password/', {
                username: username,
                email: email
            })
            console.log(response.data);
            navigate(-1);
        } catch (error) {
            console.error(error.response.data);
        }
    }


    return (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <div className='w-1/3 h-4/5 border border-black'>
                <div className='p-5'>
                    <div className='w-32 h-32 border-[3px] border-black rounded-full p-5 mx-auto mt-10'>
                        <img src={`${process.env.PUBLIC_URL}/img/lock.png`} />
                    </div>
                    <div className='text-center mt-4'>
                        <p className='text-xl font-bold'>로그인에 문제가 있나요?</p>
                        <span className='block w-2/3 mx-auto mt-5 leading-5 text-gray-700'>이메일 주소, 아이디를 입력하시면 계정에 다시 액세스할 수 있는 링크를 보내드립니다.</span>
                    </div>
                    <form className='mt-5' onSubmit={findPassword}>
                        <input className='block w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm' type="text" name='username' placeholder='아이디' value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input className='block w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm mt-3' type="text" name='email' placeholder='이메일' value={email} onChange={(e) => setEmail(e.target.value)} />
                        <button className='w-full h-10 text-white bg-sesac-green rounded-lg text-sm hover:bg-sesac-dark-green hover:transition-colors mt-5' type='submit'>로그인 링크 보내기</button>
                    </form>
                    <span className='block mt-5 relative text-center before:content-[""] before:block before:w-1/3 before:h-[1px] before:border before:border-gray-300 before:absolute before:left-5 before:top-1/2 before:-translate-y-1/2 after:content-[""] after:block after:w-1/3 after:h-[1px] after:border after:border-gray-300 after:absolute after:right-5 after:top-1/2 after:-translate-y-1/2'>또는</span>
                    <div className='text-center mt-5 font-medium'>
                        <Link to='/account/signup'>새 계정 만들기</Link>
                    </div>
                </div>
                <div className='p-5 border-y border-black bg-gray-50 text-center'>
                    <Link to='/account/login'>로그인으로 돌아가기</Link>
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;