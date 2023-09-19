/* eslint-disable */
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { getCookie, deleteCookie } from '../../modules/handle_cookie';

function Accounts() {
    const navigate = useNavigate()

    const SERVER = process.env.REACT_APP_BACK_BASE_URL
    const SERVER_ACCOUNTS_LOGOUT = `${SERVER}/accounts/logout/`

    const session_key = getCookie('session_key')

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(SERVER_ACCOUNTS_LOGOUT, {
                session_key: session_key
            })
            deleteCookie('session_key')
            navigate('/')
        } catch (error) {
            console.error(error)
        }
    }


    return (
        <div className="Accounts">
            <Link to='/accounts/login'>로그인</Link>&nbsp;|&nbsp;
            <Link to='/accounts/signup'>회원가입</Link>&nbsp;|&nbsp;
            <Link to='/accounts/find/user/id/'>아이디 찾기</Link>&nbsp;|&nbsp;
            <Link to='/accounts/find/user/password'>비밀번호 찾기</Link>&nbsp;|&nbsp;
            <button onClick={handleLogout}>로그아웃</button>
            <Outlet></Outlet>
        </div>
    );
}

export default Accounts;