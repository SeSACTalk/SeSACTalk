import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';

import { setRole } from '../../../store/userSlice';

/* Components */
import Navbar from './Navbar';
import WritePost from '../post/WritePost';
import MinNavbar from './MinNavbar';
import AdminNavbar from '../../admin/AdminNavbar';

const Main = function () {
    let navigate = useNavigate();
    let dispatch = useDispatch();

    /* States */
    let role = useSelector((state) => state.role);
    let writeModal = useSelector((state) => state.writeModal);
    let minNav = useSelector((state) => state.minNav);

    useEffect(() => {
        axios.get('/accounts/user/info/')
            .then(
                response => {
                    dispatch(setRole(response.data.role));
                }
            )
            .catch(
                error => {
                    console.error(error.message);
                    navigate('/account/login');
                }
            )
    }, [dispatch, navigate]);

    return (
        <div className='main_container flex relative'>
            {
                role === 'STAFF' ? <AdminNavbar /> : minNav ? <MinNavbar /> : <Navbar />
            }
            <Outlet />
            {/* Modals */}
            {writeModal && <WritePost />}
        </div >
    );


};

export default Main;