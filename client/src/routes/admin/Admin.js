import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import axios from 'axios';

import { setRole } from '../../store/userSlice';
// components
import AdminNavbar from './AdminNavbar';

function Admin() {
    let navigate = useNavigate();
    let dispatch = useDispatch();

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
        <div className="admin_container flex relative">
            <AdminNavbar />
            <Outlet />
        </div>
    );
}

export default Admin;