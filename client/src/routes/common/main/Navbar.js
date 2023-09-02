import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { changeWirteModal } from "../../../store/modalSlice";

const Navbar = function () {
    // states
    let writeModal = useSelector((state) => state.wirteModal)
    let dispatch = useDispatch();

    return (
        <nav className="nav_wrap w-1/5 p-3 h-screen sticky border-solid border border-gray-300 ">
            <div className="nav_profile flex justify-center">
                <div className='profile_wrap p-4'>
                    <div className='logo_wrap w-20 m-auto'>
                        <Link to='/'>
                            <img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt='청년취업사관학교' />
                        </Link>
                    </div>
                    <div className='logo_wrap w-32 p-2 rounded-full overflow-hidden border border-solid border-gray-200'>
                        <img src={`${process.env.PUBLIC_URL}/img/default_profile.png`} alt='김새싹' />
                    </div>
                </div>
            </div>
            <ul className="nav mt-8 px-8 flex flex-col gap-7 text-2xl">
                <li>
                    <Link to='/'>
                        <i className="fa fa-home mr-3" aria-hidden="true"></i>
                        <span>홈</span>
                    </Link>
                </li>
                <li>
                    <Link to='#'>
                        <i className="fa fa-search mr-3" aria-hidden="true"></i>
                        <span>검색</span>
                    </Link>
                </li>
                <li>
                    <Link to='/chat'>
                        <i className="fa fa-comments-o mr-3" aria-hidden="true"></i>
                        <span>메시지</span>
                    </Link>
                </li>
                <li>
                    <Link to='#'>
                        <i className="fa fa-bell-o mr-3" aria-hidden="true"></i>
                        <span>알림</span>
                    </Link>
                </li>
                <li>
                    <Link to='#' onClick={(e) => { dispatch(changeWirteModal(writeModal)) }}>
                        <i className="fa fa-pencil-square-o mr-3" aria-hidden="true"></i>
                        <span>글쓰기</span>
                    </Link>
                </li>
                <li>
                    <Link to='#'>
                        <i class="fa fa-file-text-o mr-3" aria-hidden="true"></i>
                        <span>채용공고</span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar