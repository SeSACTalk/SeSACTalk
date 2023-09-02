import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";

// Components
import Navbar from './Navbar';
import Posts from './Posts';
import WritePost from '../post/WritePost';

const Main = function () {
    let writeModal = useSelector((state) => state.wirteModal)

    return (
        <div className='main_container flex'>
            <Navbar />
            <Posts />
            {/* Modals */}
            {console.log(writeModal)}
            {writeModal && <p>headers</p>}
        </div >
    );
};

export default Main;