import React from "react";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { changeWirteModal } from "../../../store/modalSlice";
import { getCookie } from "../../../modules/handle_cookie";
import { showMinNav, showExploreNav } from "../../../store/navSlice";

const username = getCookie('username')
const SERVER = process.env.REACT_APP_BACK_BASE_URL;

const Navbar = function () {
    // states
    let writeModal = useSelector((state) => state.wirteModal)
    let minNav = useSelector((state) => state.minNav)
    let exploreNav = useSelector((state) => state.exploreNav)

    let dispatch = useDispatch();

    return (
        <nav className={`nav_wrap w-1/5 p-3 h-screen sticky top-0 border-solid border-x border-gray-300 ${minNav ? 'animate-hide pointer-events-none' : 'animate-intro'}`}>
            <div className="nav_profile flex justify-center">
                <div className="profile_wrap p-4">
                    <div className='logo_wrap w-20 m-auto'>
                        <Link to='/'>
                            <img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt='청년취업사관학교' />
                        </Link>
                    </div>
                    <div className='logo_wrap w-32 rounded-full overflow-hidden border border-solid border-gray-200'>
                        <Link className="block w-full h-full p-2" to={`/profile/${username}`}>
                            <img src={`${SERVER}/media/profile/default_profile.png`} alt={username} />
                        </Link>
                    </div>
                </div>
            </div>
            <h2 className="hidden">메인메뉴</h2>
            <ul className="nav mt-8 px-8 flex flex-col gap-7 text-2xl">
                <li>
                    <Link to='/'>
                        <i className="fa fa-home mr-3" aria-hidden="true"></i>
                        <span>홈</span>
                    </Link>
                </li>
                <li>
                    <Link to='#' onClick={(e) => {
                        e.preventDefault();
                        dispatch(showMinNav(minNav))
                        dispatch(showExploreNav(exploreNav))
                    }}>
                        <i className="fa fa-search mr-3" aria-hidden="true"></i>
                        <span>검색</span>
                    </Link>
                </li>
                <li>
                    <Link to='/chat' onClick={(e) => {
                        dispatch(showMinNav(minNav))
                    }}>
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
                    <Link to='#' onClick={(e) => {
                        e.preventDefault();
                        dispatch(changeWirteModal(writeModal));
                    }}>
                        <i className="fa fa-pencil-square-o mr-3" aria-hidden="true"></i>
                        <span>글쓰기</span>
                    </Link>
                </li>
                <li>
                    <Link to='#'>
                        <i className="fa fa-file-text-o mr-3" aria-hidden="true"></i>
                        <span>채용공고</span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar