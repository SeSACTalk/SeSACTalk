/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';

const PasswordReset = function () {
    let navigate = useNavigate();

    /* States */
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isWriting, setIsWriting] = useState(false);
    const [passwordModal, setPasswordModal] = useState(false);

    /* Refs */
    const submitButton = useRef(null);

    useEffect(() => {
        if (username.length === 0 || email.length === 0) {
            submitButton.current.setAttribute('disabled', 'disabled');
            setIsWriting(false);
        } else {
            setIsWriting(true);
            submitButton.current.removeAttribute('disabled');
        }
    }, [username, email])

    /**
     * 비밀번호 찾기 요청 함수
     * @param {Event} e 
     */
    const findPassword = async (e) => {
        e.preventDefault();
        let regex = /^[a-zA-Z\d`~!@#$%^&*-_=]+$/;
        let emailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
        if (regex.test(username) && emailRegex.test(email)) {
            try {
                await axios.post('/accounts/find/user/password/', {
                    username: username,
                    email: email
                });
                navigate('/account/login');
            } catch (error) {
                setPasswordModal(!passwordModal);
            }
        } else {
            setPasswordModal(!passwordModal);
        }
    }

    return (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <div className='w-1/3 border'>
                <div className='p-5'>
                    <div className='w-32 h-32 border-[3px] border-black rounded-full p-5 mx-auto mt-10'>
                        <img src={`${process.env.PUBLIC_URL}/img/lock.png`} alt='SeSAC' />
                    </div>
                    <div className='text-center mt-4'>
                        <p className='text-xl font-bold'>로그인에 문제가 있나요?</p>
                        <span className='block w-3/4 mx-auto mt-5 leading-5 text-gray-700'>이메일 주소, 아이디를 입력하시면 계정에 다시 액세스할 수 있는 임시 비밀번호를 보내드립니다.</span>
                    </div>
                    <form className='mt-5'>
                        <input className='block w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm' type="text" name='username' placeholder='아이디' value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input className='block w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm mt-3' type="email" name='email' placeholder='이메일' value={email} onChange={(e) => setEmail(e.target.value)} />
                        <button className={`w-full h-10 text-white bg-sesac-sub2 rounded-lg text-sm mt-5 ${isWriting ? 'hover:bg-sesac-dark-green hover:transition-colors' : 'opacity-50 cursor-not-allowed'}`} type='button' ref={submitButton} onClick={findPassword}>로그인 링크 보내기</button>
                    </form>
                    <span className='block mt-3 relative text-center before:content-[""] before:block before:w-1/3 before:h-[1px] before:border before:border-gray-300 before:absolute before:left-5 before:top-1/2 before:-translate-y-1/2 after:content-[""] after:block after:w-1/3 after:h-[1px] after:border after:border-gray-300 after:absolute after:right-5 after:top-1/2 after:-translate-y-1/2'>또는</span>
                    <div className='text-center mt-5 font-medium'>
                        <Link to='/account/signup'>새 계정 만들기</Link>
                    </div>
                </div>
                <div className='p-5 border-t bg-gray-50 text-center'>
                    <Link to='/account/login'>로그인으로 돌아가기</Link>
                </div>
            </div>
            {passwordModal && <PasswordResetModal passwordModal={passwordModal} setPasswordModal={setPasswordModal} />}
        </div>
    )
}

const PasswordResetModal = function ({ passwordModal, setPasswordModal }) {
    const modalPopup = useRef(null);

    /**
     * 검은배경 클릭시 모달창 닫기
     * @param {Event} e 
     */
    const closeModal = (e) => {
        if (modalPopup.current === e.target) {
            setPasswordModal(!passwordModal);
        }
    }

    return (
        <div className="modal post_modal flex justify-center items-center absolute w-full h-screen z-50" ref={modalPopup} onClick={closeModal}>
            <div className='flex flex-col justify-center items-center w-1/3 h-52 p-5 bg-zinc-50 rounded-xl text-red-500'>
                <p>입력해주신 정보와 일치하는 계정이 없습니다.
                </p>
            </div>
        </div>
    )
}
export default PasswordReset;