import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';

import { setRole } from '../../store/userSlice';
// components
import AdminNavbar from './AdminNavbar';
import WritePost from '../common/post/WritePost';

function Admin() {
    let navigate = useNavigate();
    let dispatch = useDispatch();

    // States
    let writeModal = useSelector((state) => state.writeModal);

    useEffect(() => {
        axios.get('/accounts/user/info/')
            .then(
                response => {
                    // dispatch(setRole(response.data.role));
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
        <div className="admin_container flex relative">
            <AdminNavbar />
            <Outlet />
            {/* Modals */}
            {writeModal && <WritePost />}
        </div>
    );
}

export default Admin;