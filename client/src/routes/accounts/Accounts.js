/* eslint-disable */
import React, {useEffect} from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';


function Accounts() {
    return (
        <div className="Accounts">
            <Link to='/accounts/login'>로그인</Link>&nbsp;|&nbsp;
            <Link to='/accounts/signup'>회원가입</Link>&nbsp;|&nbsp;
            <Link to='/accounts/find/user/id/'>아이디 찾기</Link>&nbsp;|&nbsp;
            <Link to='/accounts/find/user/password'>비밀번호 찾기</Link>
            <Outlet></Outlet>
        </div>
    );
}

export default Accounts;