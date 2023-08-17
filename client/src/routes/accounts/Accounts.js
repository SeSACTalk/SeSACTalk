/* eslint-disable */
import React, {useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getCookie } from '../../modules/handle_cookie'
import checkAuthMiddleware from '../../middleware/checkAuth'


function Accounts() {
    return (
        <div className="Accounts">
            <Link to='/accounts/login'>로그인</Link>&nbsp;|&nbsp;
            <Link to='/accounts/signup'>회원가입</Link>&nbsp;|&nbsp;
            <Link to='/accounts/find/user/id/'>아이디 찾기</Link>&nbsp;|&nbsp;
            <Link to='/accounts/find/user/password'>비밀번호 찾기</Link>
        </div>
    );
}

export default Accounts;