import React from "react";
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { changeWriteModal } from "../../../store/modalSlice";
import { showMinNav, showExploreNav, showNoticeNav } from "../../../store/navSlice";

/* Components */
import Explore from "../../general/Explore";
import Notice from "../../general/Notice";

const MinNavbar = function () {
    const location = useLocation();
    let dispatch = useDispatch();

    /* States */
    let writeModal = useSelector((state) => state.writeModal);
    let minNav = useSelector((state) => state.minNav);
    let exploreNav = useSelector((state) => state.exploreNav);
    let noticeNav = useSelector((state) => state.noticeNav);

    /**
     * 모달창 제어
     */
    const handleSubNav = () => {
        // minNav이 활성화상태일때만 닫혀야함
        minNav && dispatch(showMinNav(minNav));
        // minNav가 true일때만 같이 보여야하고, false이면 false로
        if (minNav && exploreNav) {
            dispatch(showExploreNav(exploreNav));
        }
        if (minNav && noticeNav) {
            dispatch(showNoticeNav(noticeNav));
        }
    }

    return (
        <div className={location.pathname.includes('chat') ? '' : 'w-1/5'}>
            <nav className={`w-24 px-3 py-14 sticky top-0 z-10 h-screen border-x border-gray-300 ${location.pathname.includes('chat') ? '' : minNav ? 'animate-intro' : 'hidden'}`}>
                <div className='w-10 mx-auto'>
                    <Link to='/' onClick={(e) => {
                        handleSubNav()
                    }}>
                        <img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt='청년취업사관학교' />
                    </Link>
                </div>
                <h2 className="hidden">서브메뉴</h2>
                <ul className="mt-8 flex flex-col items-center gap-7 text-2xl">
                    <li>
                        <Link to='/' onClick={(e) => {
                            handleSubNav()
                        }}>
                            <i className="fa fa-home" aria-hidden="true"></i>
                            <span className="hidden">홈</span>
                        </Link>
                    </li>
                    <li>
                        <Link to='#' onClick={(e) => {
                            e.preventDefault();
                            if (!location.pathname.includes('chat')) {
                                handleSubNav()
                            } else {
                                dispatch(showExploreNav(exploreNav))
                            }
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
                        <Link to='#' onClick={(e) => {
                            e.preventDefault();
                            if (!location.pathname.includes('chat')) {
                                handleSubNav()
                            } else {
                                dispatch(showNoticeNav(noticeNav))
                            }
                        }}>
                            <i className="fa fa-bell-o" aria-hidden="true"></i>
                            <span className="hidden">알림</span>
                        </Link>
                    </li>
                    <li>
                        <Link to='#' onClick={(e) => {
                            e.preventDefault();
                            dispatch(changeWriteModal(writeModal))
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
                {noticeNav && <Notice />}
            </nav>
        </div>
    )
}

export default MinNavbar