import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';

import { setRole } from '../../../store/userSlice';
// Components
import Navbar from './Navbar';
import WritePost from '../post/WritePost';
import MinNavbar from './MinNavbar';
import AdminNavbar from '../../admin/AdminNavbar';

const Main = function () {
    let navigate = useNavigate();
    let dispatch = useDispatch();;
    let location = useLocation();
    console.log(location)
    // States
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
                    console.error(error.message)
                    navigate('/accounts/login');
                }
            )
    }, []);

    return (
        <div className='main_container flex relative'>
            {role === 'USER' ? minNav ? <MinNavbar /> : <Navbar /> : <AdminNavbar />}
            <Outlet />
            {/* Modals */}
            {writeModal && <WritePost />}
        </div >
    );


};

export default Main;