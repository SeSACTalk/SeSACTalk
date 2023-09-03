import React from 'react';
import { useSelector } from "react-redux";

// Components
import Navbar from './Navbar';
import Posts from './Posts';
import WritePost from '../post/WritePost';

const Main = function () {
    let writeModal = useSelector((state) => state.writeModal)

    return (
        <div className='main_container flex relative'>
            <Navbar />
            <Posts />
            {/* Modals */}
            {writeModal && <WritePost />}
        </div >
    );
};

export default Main;