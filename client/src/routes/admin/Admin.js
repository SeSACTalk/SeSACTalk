/* eslint-disable */
import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import { getCookie } from '../../modules/handle_cookie';

function Admin() {
    let navigate = useNavigate();

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