import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';

import { setRole } from '../../../store/userSlice';
// Components
import Navbar from './Navbar';
import WritePost from '../post/WritePost';
import MinNavbar from './MinNavbar';

const Main = function () {
    let navigate = useNavigate();
    let dispatch = useDispatch();;

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

    // States
    let role = useSelector((state) => state.role);
    let writeModal = useSelector((state) => state.writeModal);
    let minNav = useSelector((state) => state.minNav);
    if (role === 'USER') {
        return (
            <div className='main_container flex relative'>
                {minNav ? <MinNavbar /> : <Navbar />}
                <Outlet />
                {/* Modals */}
                {writeModal && <WritePost />}
            </div >
        );
    } else {
        return (
            <div className='main_container flex relative'>
                <MinNavbar />
                <Outlet />
                {/* Modals */}
                {writeModal && <WritePost />}
            </div >
        )
    }
};

export default Main;