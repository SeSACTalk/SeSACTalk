import React from 'react';
import { useSelector } from "react-redux";

// Components
import Navbar from './Navbar';
import Posts from './Posts';
import WritePost from '../post/WritePost';
import MinNavbar from './MinNavbar';

const Main = function () {
    // States
    let writeModal = useSelector((state) => state.writeModal)
    let minNav = useSelector((state) => state.minNav)

    return (
        <div className='main_container flex relative'>
            {/* <MinNavbar /> */}
            {/* <Navbar /> */}
            {minNav ? <MinNavbar /> : <Navbar/>}
            <Posts />
            {/* Modals */}
            {writeModal && <WritePost />}
        </div >
    );
};

export default Main;