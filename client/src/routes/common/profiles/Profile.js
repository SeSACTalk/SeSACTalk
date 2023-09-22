import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { checkAuthMiddleware } from "../../../middleware/middleware"
import { getCookie } from "../../../modules/handle_cookie";

import React from 'react';
import { Link, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";

import ProfilePosts from "./ProfilePosts";
import ProfileLikes from "./ProfileLikes";
import ProfileReplys from "./ProfileReplys";

// Components
import Navbar from '../main/Navbar';
import { changeVerifyPasswordModal } from "../../../store/modalSlice";
import VerifyPasswordModal from "./VerifyPasswordModal";

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
    const navigate = useNavigate()

    let verifyPasswordModal = useSelector((state) => state.verifyPasswordModal)

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
    }, [username]); // username을 종속성 배열에 추가
    function MyProfileBtn() {
        let dispatch = useDispatch();

        return (
            <>
                <button className="inline-block">
                    <i className="fa fa-pencil-square-o text-2xl" aria-hidden="true" onClick={() => {
                        dispatch(changeVerifyPasswordModal(verifyPasswordModal))
                        // navigate('edit');
                    }}></i>
                </button>
                <button className="inline-block">
                    <i className="fa fa-thin fa-gear text-2xl"></i>
                </button>
            </>
        )
    }
    function OtherProfileBtn() {
        return (
            <>
                <button className="inline-block">
                    <i className="fa fa-user-plus text-2xl" aria-hidden="true"></i>
                </button>
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
                                    <li className="flex gap-2">
                                        <span>팔로워</span>
                                        <span className="font-semibold text-black">{profileData.follower_count == null ? 0 : profileData.follower_count}</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span>팔로우</span>
                                        <span className="font-semibold text-black">{profileData.follow_count == null ? 0 : profileData.follow_count}</span>
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
                    {verifyPasswordModal && <VerifyPasswordModal url = {`/profile/${username}/edit`}/>}
                </>
            )
                : (
                    <p>Loading...</p>
                )}</>
    )
}


export { ProfileLayout, Profile }