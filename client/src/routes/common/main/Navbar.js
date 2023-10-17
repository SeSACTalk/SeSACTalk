import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { changeWriteModal } from "../../../store/modalSlice";
import { showMinNav, showExploreNav, showNoticeNav } from "../../../store/navSlice";

const SERVER = process.env.REACT_APP_BACK_BASE_URL;

const Navbar = function () {
    const location = useLocation();

    // states
    let [info, setInfo] = useState({});
    let writeModal = useSelector((state) => state.wirteModal);
    let minNav = useSelector((state) => state.minNav);
    let exploreNav = useSelector((state) => state.exploreNav);
    let noticeNav = useSelector((state) => state.noticeNav);

    let dispatch = useDispatch();

    useEffect(() => {
        axios.get('/')
            .then(
                response => {
                    let copy = { ...response.data.info }
                    setInfo(copy)
                }
            )
            .catch(
                error => console.error(error)
            )
    }, []);

    return (
        <nav className={`w-1/5 p-3 h-screen sticky top-0 border-solid border-x border-gray-300 ${location.pathname === '/' ? '' : minNav ? 'animate-hide pointer-events-none' : 'animate-intro'}`
        } >
            <div className="nav_profile flex justify-center">
                <div className="profile_wrap p-4">
                    <div className='logo_wrap w-20 m-auto'>
                        <Link to='/'>
                            <img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt='청년취업사관학교' />
                        </Link>
                    </div>
                    <div className='logo_wrap w-32 h-32 rounded-full overflow-hidden border border-solid border-gray-200'>
                        <Link className={`block w-full h-full p-2 ${info['profile_set'] ? '' : 'animate-pulse'}`} to={`/profile/${info['username']}`}>
                            {
                                // 로딩중
                                info['profile_set'] ?
                                    <img src={SERVER + info['profile_set']} alt={info['username']} /> :
                                    <div className="w-full h-full flex justify-center items-center">
                                        <i className="fa fa-spinner fa-pulse fa-3x fa-fw text-5xl text-sesac-sub"></i>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                            }
                        </Link>
                    </div>
                </div>
            </div>
            <h2 className="hidden">메인메뉴</h2>
            <ul className="nav mt-8 px-8 flex flex-col gap-7 text-2xl">
                <li>
                    <Link to='/' className="block w-full h-full">
                        <i className="fa fa-home inline-block w-7 mr-3" aria-hidden="true"></i>
                        <span>홈</span>
                    </Link>
                </li>
                <li>
                    <Link to='#' className="block w-full h-full"
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch(showMinNav(minNav));
                            dispatch(showExploreNav(exploreNav));
                        }}>
                        <i className="fa fa-search inline-block w-7 mr-3" aria-hidden="true"></i>
                        <span>검색</span>
                    </Link>
                </li>
                <li>
                    <Link to='/chat' className="block w-full h-full"
                        onClick={(e) => {
                            dispatch(showMinNav(minNav))
                        }}>
                        <i className="fa fa-comments-o inline-block w-7 mr-3" aria-hidden="true"></i>
                        <span>메시지</span>
                    </Link>
                </li>
                <li>
                    <Link to='#' className="block w-full h-full"
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch(showMinNav(minNav));
                            dispatch(showNoticeNav(noticeNav));
                        }}>
                        <i className="fa fa-bell-o inline-block w-7 mr-3" aria-hidden="true"></i>
                        <span>알림</span>
                    </Link>
                </li>
                <li>
                    <Link to='#' className="block w-full h-full"
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch(changeWriteModal(writeModal))
                        }}>
                        <i className="fa fa-pencil-square-o inline-block w-7 mr-3" aria-hidden="true"></i>
                        <span>글쓰기</span>
                    </Link>
                </li>
                <li>
                    <Link to='#' className="block w-full h-full">
                        <i className="fa fa-file-text-o inline-block w-7 mr-3" aria-hidden="true"></i>
                        <span>채용공고</span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar