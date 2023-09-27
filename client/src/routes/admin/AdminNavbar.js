import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

const AdminNavbar = function () {
    // states
    let [info, setInfo] = useState({});

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
        <nav className="w-1/5 p-3 h-screen sticky top-0 border-solid border-x border-gray-300}">
            <div className="nav_profile flex justify-center">
                <div className="profile_wrap p-4">
                    <div className='logo_wrap w-20 m-auto'>
                        <Link to='/'>
                            <img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt='청년취업사관학교' />
                        </Link>
                    </div>
                    <p className="mt-3 text-3xl text-sesac-green font-medium">{info['campus_name']}</p>
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
                    <Link to='/admin/user' className="block w-full h-full">
                        <i className="fa fa-search inline-block w-7 mr-3" aria-hidden="true"></i>
                        <span>사용자 조회</span>
                    </Link>
                </li>
                <li>
                    <Link to='/admin/auth/user' className="block w-full h-full">
                        <i className="fa fa-id-badge inline-block w-7 mr-3" aria-hidden="true"></i>
                        <span>권한 승인</span>
                    </Link>
                </li>
                <li>
                    <Link to='/chat' className="block w-full h-full">
                        <i className="fa fa-comments-o inline-block w-7 mr-3" aria-hidden="true"></i>
                        <span>메시지</span>
                    </Link>
                </li>
                <li>
                    <Link to='#' className="block w-full h-full">
                        <i className="fa fa-bell-o inline-block w-7 mr-3" aria-hidden="true"></i>
                        <span>알림</span>
                    </Link>
                </li>
                <li>
                    <Link to='#' className="block w-full h-full">
                        <i className="fa fa-pencil-square-o inline-block w-7 mr-3" aria-hidden="true"></i>
                        <span>글쓰기</span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default AdminNavbar;