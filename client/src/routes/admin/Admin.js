/* eslint-disable */
import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Admin() {
    let navigate = useNavigate();

    useEffect(() => {
        axios.get('/accounts/user/info/')
            .then(
                response => {
                    dispatch(setRole(response.data.role));
                    if (response.data.role === 'USER') {
                        navigate('/')
                    } else {
                        return
                    }
                }
            )
            .catch(
                error => {
                    console.error(error.message)
                    navigate('/accounts/login');
                }
            )
    }, []);

    return (
        <div className="Common">
            <Link to={`/admin/user`}>사용자 조회</Link>&nbsp;|&nbsp;
            <Link to={`/admin/auth/user`}>사용자 권한</Link>&nbsp;|&nbsp;
            <Link to={`/admin/notify/report`}>신고 내역</Link>{/* &nbsp;|&nbsp; */}
            <Outlet></Outlet>
        </div>
    );
}

export default Admin;