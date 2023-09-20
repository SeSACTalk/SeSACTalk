import React, { useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { changeWirteModal } from "../../../store/modalSlice";
import { showMinNav, showExploreNav } from "../../../store/navSlice";

import Explore from "../../general/Explore";

const MinNavbar = function () {
    const location = useLocation()

    // states
    let writeModal = useSelector((state) => state.wirteModal)
    let minNav = useSelector((state) => state.minNav)
    let exploreNav = useSelector((state) => state.exploreNav)

    let dispatch = useDispatch();

    useEffect(() => {
        // chat일때 실행, 새로고침시 실행되게 하려고..
        if (location.pathname.includes('chat')) {
            console.log('condition', minNav)
            console.log(location)
            dispatch(showMinNav(minNav))
        }
    }, [])

    return (
        <>
            <nav className={`nav_wrap w-24 px-3 py-14 sticky top-0 z-10 h-screen border-x border-gray-300 ${minNav ? 'animate-intro' : 'hidden'}`}>
                <div className='logo_wrap w-10 mx-auto'>
                    <Link to='/' onClick={(e) => {
                        dispatch(showMinNav(minNav))
                    }}>
                        <img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt='청년취업사관학교' />
                    </Link>
                </div>
                <h2 className="hidden">서브메뉴</h2>
                <ul className="nav mt-8 flex flex-col items-center gap-7 text-2xl">
                    <li>
                        <Link to='/' onClick={(e) => {
                            dispatch(showMinNav(minNav))
                        }}>
                            <i className="fa fa-home" aria-hidden="true"></i>
                            <span className="hidden">홈</span>
                        </Link>
                    </li>
                    <li>
                        <Link to='#' onClick={(e) => {
                            e.preventDefault();
                            dispatch(showMinNav(minNav))
                            dispatch(showExploreNav(exploreNav))
                        }}>
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
                        <Link to='#' onClick={(e) => {
                            e.preventDefault();
                            dispatch(changeWirteModal(writeModal))
                        }}>
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
                {/* SubNavbar */}
                {exploreNav && <Explore />}
            </nav>
        </>
    )
}

export default MinNavbar