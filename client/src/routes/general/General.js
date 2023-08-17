/* eslint-disable */
import React, {useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getCookie } from '../../modules/handle_cookie'
import checkAuthMiddleware from '../../middleware/checkAuth'


function General() {
    let navigate = useNavigate();
    const redirectToLogin = () => {
        navigate('/accounts/login'); // 로그인 페이지로 이동
        };
    useEffect(() => {
        checkAuthMiddleware()
            .then(() => {
            })
            .catch(() => {
            redirectToLogin();
            });
        }, []);

    let username = getCookie('username')
    return (
        <div className="General">
            <Link to={`/post/${username}`}>전체 게시물 보기</Link>{/* &nbsp;|&nbsp; */}
        </div>
    );
}

export default General;