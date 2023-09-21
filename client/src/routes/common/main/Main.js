import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from "react-redux";

// Components
import Navbar from './Navbar';
import WritePost from '../post/WritePost';
import MinNavbar from './MinNavbar';

const Main = function () {
    // States
    let writeModal = useSelector((state) => state.writeModal)
    let minNav = useSelector((state) => state.minNav)

    return (
        <div className='main_container flex relative'>
            {minNav ? <MinNavbar /> : <Navbar />}
            <Outlet />
            {/* Modals */}
            {writeModal && <WritePost />}
        </div >
    );
};

export default Main;