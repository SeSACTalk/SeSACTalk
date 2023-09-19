import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { changeWirteModal } from "../../../store/modalSlice";
import { getCookie } from "../../../modules/handle_cookie";

const username = getCookie('username')
const SERVER = process.env.REACT_APP_BACK_BASE_URL;

const Navbar = function () {
    // states
    let writeModal = useSelector((state) => state.wirteModal)
    let dispatch = useDispatch();

    return (
        <nav className="nav_wrap w-24 px-3 py-14 h-screen  border-solid border-x border-gray-300">
            <div className='logo_wrap w-10 mx-auto'>
                <Link to='/'>
                    <img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt='청년취업사관학교' />
                </Link>
            </div>
            <ul className="nav mt-8 flex flex-col items-center gap-7 text-2xl">
                <li>
                    <Link to='/'>
                        <i className="fa fa-home" aria-hidden="true"></i>
                        <span className="hidden">홈</span>
                    </Link>
                </li>
                <li>
                    <Link to='#'>
                        <i className="fa fa-search" aria-hidden="true"></i>
                        <span className="hidden">검색</span>
                    </Link>
                </li>
                <li>
                    <Link to='/chat'>
                        <i className="fa fa-comments-o" aria-hidden="true"></i>
                        <span className="hidden">메시지</span>
                    </Link>
                </li>
                <li>
                    <Link to='#'>
                        <i className="fa fa-bell-o" aria-hidden="true"></i>
                        <span className="hidden">알림</span>
                    </Link>
                </li>
                <li>
                    <Link to='#' onClick={(e) => { dispatch(changeWirteModal(writeModal)) }}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                        <span className="hidden">글쓰기</span>
                    </Link>
                </li>
                <li>
                    <Link to='#'>
                        <i className="fa fa-file-text-o" aria-hidden="true"></i>
                        <span className="hidden">채용공고</span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar