import React, { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';

import { deleteCookie } from '../../modules/handle_cookie';

function Accounts() {

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.delete('/accounts/logout/')
            console.log(response.status)
            deleteCookie('session_key')
            deleteCookie('username')
            window.location.href = '/'
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        axios.get('/accounts/user/info/')
            .then(
                response => {
                    if (response.status === 200) {
                        if (response.data.role === 'USER') {
                            window.location.href = '/'
                        } else {
                            window.location.href = '/admin'
                        }
                    }
                }
            )
            .catch(
                error => {
                    console.clear()
                }
            )
    }, []);

    return (
        <div className="Accounts">
            <Link to='/accounts/login'>로그인</Link>&nbsp;|&nbsp;
            <Link to='/accounts/signup'>회원가입</Link>&nbsp;|&nbsp;
            <Link to='/accounts/find/user/id/'>아이디 찾기</Link>&nbsp;|&nbsp;
            <Link to='/accounts/find/user/password'>비밀번호 찾기</Link>&nbsp;|&nbsp;
            <button onClick={handleLogout}>로그아웃</button>
            <Outlet></Outlet>
        </div>
    )
}

export default Accounts;