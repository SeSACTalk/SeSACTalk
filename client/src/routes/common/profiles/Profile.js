import { useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { checkAuthMiddleware } from "../../../middleware/middleware"
import { getCookie, deleteCookie } from "../../../modules/handle_cookie";

import React from 'react';
import { Link, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";

import { ProfilePosts, ProfileLikes, ProfileReplys } from "./ProfileNav";

// Components
import Navbar from '../main/Navbar';
import { changeVerifyPasswordModal, changeFollowModal, changeFollowerModal, changeProfileSettingModal } from "../../../store/modalSlice";
import VerifyPasswordModal from "./VerifyPasswordModal";
import { FollowModal, FollowerModal } from "./UserRelationshipModal";

const SERVER = process.env.REACT_APP_BACK_BASE_URL
const session_key = getCookie('session_key')


const ProfileLayout = function () {
    const navigate = useNavigate()
    useEffect(() => {
        checkAuthMiddleware()
            .then(() => {
            })
            .catch(() => {
                navigate('/accounts/login'); // 로그인 페이지로 이동
            });
    }, []);

    return (
        <div className='main_container flex relative'>
            <Navbar />
            <div className="main_content_container w-full">
                <div className="profile_container pt-12 px-20 text-lg">
                    <Outlet />
                </div>
            </div>
        </div >
    );
};

function Profile() {
    const { username } = useParams()
    const SERVER_USER_PROFILE = `${SERVER}/profile/${username}`

    let dispatch = useDispatch();
    let verifyPasswordModal = useSelector((state) => state.verifyPasswordModal)
    let followModal = useSelector((state) => state.followModal)
    let followerModal = useSelector((state) => state.followerModal)
    let profileSettingModal = useSelector((state) => state.profileSettingModal)

    // state 
    const [postClickStatus, setPostClickStatus] = useState(true)
    const [likeClickStatus, setLikeClickStatus] = useState(false)
    const [replyClickStatus, setReplyClickStatus] = useState(false)

    const navStyle = "border-t-2 border-gray-600 relative -top-0.5"

    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(SERVER_USER_PROFILE, {
                    headers: {
                        'Authorization': `${session_key}`
                    }
                });

                if (response.status === 200) {
                    const data = response.data;
                    setProfileData(data); // profileData 설정
                    console.log(data);
                } else {
                    console.error('Error fetching profile data');
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        }
        fetchData();

        // 팔로우, 팔로워 창에서 프로필 페이지로 이동했을 때 모달창을 닫기
        if (followModal) {
            dispatch(changeFollowModal(followModal));
        }
        if (followerModal) {
            dispatch(changeFollowerModal(followerModal));
        }
    }, [username]); // username을 종속성 배열에 추가

    function MyProfileBtn() {
        let dispatch = useDispatch();

        return (
            <>
                <button className="inline-block">
                    <i className="fa fa-pencil-square-o text-2xl" aria-hidden="true" onClick={() => {
                        dispatch(changeVerifyPasswordModal(verifyPasswordModal))
                    }}></i>
                </button>
                <button className="inline-block">
                    <i className="fa fa-thin fa-gear text-2xl" onClick={() => {
                        dispatch(changeProfileSettingModal(profileSettingModal))
                    }}></i>
                </button>
            </>
        )
    }
    function OtherProfileBtn() {
        return (
            <>
                <button class="inline-block px-4 py-2 font-semibold text-sm bg-sesac-green text-white rounded-full shadow-sm">팔로잉</button>
                <button className="inline-block">
                    <i className="fa fa-envelope-o text-2xl" aria-hidden="true"></i>
                    {/* 팔로우 취소 일 때 -> <i class="fa fa-user-times" aria-hidden="true"></i> */}
                </button>
            </>
        )
    }

    return (
        // 전체 컨테이너
        <>
            {profileData ? (
                <>
                    <header className="profile_header flex mb-8 min-h-full">
                        {/* 프로필 사진 */}
                        <div className="profile_img_container flex justify-center w-2/6 h-36 ">
                            <div className="profile_img_div w-36 TOP self-center rounded-full overflow-hidden border-4 border-solid border-sesac-green p-2">
                                <img className="block p-2" src={`${SERVER + profileData.img_path}`} alt='프로필 이미지' />
                            </div>
                            {/*  */}
                        </div>
                        {/* 
                    이름, 캠퍼스명, 수정, 설정
                    게시물, 팔로워, 팔로우
                    한줄소개
                    링크
                */}
                        <section className="profile_userinfo_container flex flex-col gap-4 w-6/12 h-44 px-1 ">
                            <div className="flex flex-col gap-1">
                                <div className="profile_userinfo flex">
                                    <div>
                                        <h2 className="inline-block font-bold text-2xl mr-3">{profileData.user_name}</h2>
                                        <span className="inline-block text-sesac-green font-semibold text-sm">{profileData.user_campusname} 캠퍼스</span>
                                    </div>
                                    <div className=" ml-auto flex gap-3">
                                        {profileData.isProfileMine ? <MyProfileBtn /> : <OtherProfileBtn />}
                                    </div>
                                </div>
                                <ul className="profile_user_stats flex gap-12 text-slate-600">
                                    <li className="flex gap-2">
                                        <span>게시물</span>
                                        <span className="font-semibold text-black">{profileData.post_count}</span>
                                    </li>
                                    <li>
                                        <Link className="flex gap-2" to='#' onClick={(e) => { dispatch(changeFollowerModal(followerModal)) }}>
                                            <span>팔로워</span>
                                            <span className="font-semibold text-black">{profileData.follower_count == null ? 0 : profileData.follower_count}</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="flex gap-2" to='#' onClick={(e) => { dispatch(changeFollowModal(followModal)) }}>
                                            <span>팔로우</span>
                                            <span className="font-semibold text-black">{profileData.follow_count == null ? 0 : profileData.follow_count}</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex flex-col gap-2">
                                {
                                    profileData.content ?
                                        <div className="flex flex-col gap-1 text-sm">
                                            <div className="text-sesac-green">한줄소개</div>
                                            <div className="font-semibold">{profileData.content}</div>
                                        </div>
                                        : null
                                }
                                {
                                    profileData.link ?
                                        <div className="text-sm">
                                            <div className="text-sesac-green">링크</div>
                                            <div className="font-semibold">{profileData.link}</div>
                                        </div>
                                        : null
                                }
                            </div>
                        </section>
                    </header>
                    {/* 
                게시물, 좋아요, 댓글
            */}
                    <div className="profile_nav flex gap-32 align-middle justify-center border-t-2 border-gray-300 text-base">
                        <Link to='' className={`p-3 ${postClickStatus ? navStyle : ''}`} onClick={
                            () => {
                                setPostClickStatus(true); setLikeClickStatus(false); setReplyClickStatus(false);
                            }
                        }>
                            <span>게시물</span>
                        </Link>
                        <Link to='' className={`p-3 ${likeClickStatus ? navStyle : ''}`} onClick={
                            () => {
                                setPostClickStatus(false); setLikeClickStatus(true); setReplyClickStatus(false);
                            }
                        }>
                            <span>좋아요</span>
                        </Link>
                        <Link to='' className={`p-3 ${replyClickStatus ? navStyle : ''}`} onClick={
                            () => {
                                setPostClickStatus(false); setLikeClickStatus(false); setReplyClickStatus(true);
                            }
                        }>
                            <span>댓글</span>
                        </Link>
                    </div>
                    <div className="profile_navmx-auto">
                        {/* 게시물, 좋아요, 댓글 디테일 */}
                        {postClickStatus ? <ProfilePosts user_id={profileData.user_id} /> : null}
                        {likeClickStatus ? <ProfileLikes user_id={profileData.user_id} /> : null}
                        {replyClickStatus ? <ProfileReplys user_id={profileData.user_id} /> : null}
                    </div>

                    {/* Modals */}
                    {verifyPasswordModal && <VerifyPasswordModal url={`/profile/${username}/edit`} />}
                    {followModal && <FollowModal user_pk={profileData.user_id} />}
                    {followerModal && <FollowerModal user_pk={profileData.user_id} />}
                    {profileSettingModal && <ProfileSettingModal user_pk={profileData.user_id} />}
                </>
            )
                : (
                    <p>Loading...</p>
                )}</>
    )
}

function ProfileSettingModal({ user_pk }) {
    /* DOM */
    const modalPopup = useRef()
    let dispatch = useDispatch();
    let verifyPasswordModal = useSelector((state) => state.verifyPasswordModal)
    let profileSettingModal = useSelector((state) => state.profileSettingModal)

    /* states */
    const [scroll, setScroll] = useState();

    /* SERVER */
    const SERVER_WITHDRAW = `${SERVER}/user/${user_pk}/withdraw/`
    const SERVER_ACCOUNTS_LOGOUT = `${SERVER}/accounts/logout/`

    /* etc */
    const navigate = useNavigate()

    useEffect(() => {
        setScroll(window.scrollY)
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';

        }
    }, [scroll])

    /* functions */
    // 모달창 닫기
    const closeModal = (e) => {
        if (modalPopup.current === e.target) {
            dispatch(changeProfileSettingModal(profileSettingModal))
        }
    }

    // 로그아웃
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(SERVER_ACCOUNTS_LOGOUT, {
                session_key: session_key
            })
            deleteCookie('session_key');
            deleteCookie('username');
            navigate('/accounts/login');
        } catch (error) {
            console.error(error)
        }
    }
    // 회원 탈퇴
    const handleWithdraw = async (e) => {
        e.preventDefault();
        await axios.post(SERVER_WITHDRAW, null, {
            headers: {
                'Authorization': session_key
            },
        })
            .then(response => {
                console.log(response.data)
                console.log('회원 탈퇴 완료');
                handleLogout();
            })
            .catch(error => {
                // 잘못된 접근
                console.log(error.response.data);
                dispatch(changeProfileSettingModal(profileSettingModal));
            });
    }

    return (
        <div className="modal profile_setting_modal flex justify-center items-center absolute left-0 w-full h-screen" style={{ top: scroll }} ref={modalPopup} onClick={closeModal}>
            <div className="absolute flex justify-center items-center rounded-lg w-1/4 h-44 p-3 bg-zinc-50">
                <ul className="post_option flex-row gap-2 w-5/6 h-4/5 bg-zinc-50 border border-solid border-black text-xl">
                    <li className="border-b border-black h-1/2">
                        <button className="block w-full h-full" type="button" onClick={(e) => {
                            dispatch(changeProfileSettingModal(profileSettingModal));
                            handleLogout(e);
                        }}>로그아웃</button>
                    </li>
                    <li className="h-1/2">
                        <button className="block w-full h-full text-red-500" type="button" onClick={(e) => {
                            dispatch(changeProfileSettingModal(profileSettingModal));

                        }}>회원탈퇴</button>
                    </li>
                </ul>
            </div>
            {/* Modals */}
            {verifyPasswordModal && <VerifyPasswordModal url={`/accounts/login`} />}
        </div >
    )
}

export { ProfileLayout, Profile }