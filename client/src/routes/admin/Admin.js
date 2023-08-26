/* eslint-disable */
import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import { getCookie } from '../../modules/handle_cookie'
import { checkAuthMiddleware, checkInfoMiddleware } from '../../middleware/middleware';


function Admin() {
    let navigate = useNavigate();
    useEffect(() => {
        checkAuthMiddleware()
            .then(() => {
                checkInfoMiddleware()
                    .then(() => {
                        navigate('/admin')
                    })
                    .catch(() => {
                        console.log('어드민 페이지이므로 접근이 불가합니다.\n/general로 이동')
                        navigate('/general')
                    })
            })
            .catch(() => {
                navigate('/accounts/login');
            });
    }, []);

    let username = getCookie('username')
    return (
        <div className="Common">
            <Link to={`/post/${username}`}>Post</Link>&nbsp;|&nbsp;
            <Link to={`/admin/user`}>사용자 조회</Link>&nbsp;|&nbsp;
            <Link to={`/admin/auth/user`}>사용자 권한</Link>&nbsp;|&nbsp;
            <Link to={`/admin/notify/report`}>신고 내역</Link>{/* &nbsp;|&nbsp; */}
            <Outlet></Outlet>
        </div>
    );
}

export default Admin;