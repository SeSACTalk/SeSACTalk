import { useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { getCookie, deleteCookie } from "../../../modules/handle_cookie";

import React from 'react';
import { Link, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";

// Components
import { changeVerifyPasswordForWithdrawModal, changeOwnFollowModal, changeOwnFollowerModal, changeOtherFollowModal, changeOtherFollowerModal, changeProfileSettingModal, changeVerifyPasswordForEditProfileModal } from "../../../store/modalSlice";
import Navbar from '../main/Navbar';
import { ProfilePosts, ProfileLikes, ProfileReplys } from "./ProfileNav";
import VerifyPasswordModal from "./VerifyPasswordModal";
import { OwnFollowerModal, OwnFollowModal, OtherFollowModal, OtherFollowerModal } from "./UserRelationshipModal";

const SERVER = process.env.REACT_APP_BACK_BASE_URL
const session_key = getCookie('session_key')

function ProfileLayout() {
    return (
            <div className="main_content_container w-4/5">
                <div className="profile_container pt-12 px-20 text-lg">
                    <Outlet />
                </div>
            </div>
    );
};

function Profile() {
    const { username } = useParams()
    const SERVER_USER_PROFILE = `${SERVER}/profile/${username}`

    let navigate = useNavigate();
    let dispatch = useDispatch();
    let verifyPasswordForEditProfileModal = useSelector((state) => state.verifyPasswordForEditProfileModal)
    let ownFollowModal = useSelector((state) => state.ownFollowModal)
    let ownFollowerModal = useSelector((state) => state.ownFollowerModal)
    let otherFollowModal = useSelector((state) => state.otherFollowModal)
    let otherFollowerModal = useSelector((state) => state.otherFollowerModal)
    let profileSettingModal = useSelector((state) => state.profileSettingModal)

    // state 
    const [postClickStatus, setPostClickStatus] = useState(true);
    const [likeClickStatus, setLikeClickStatus] = useState(false);
    const [replyClickStatus, setReplyClickStatus] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [followCount, setFollowCount] = useState(0);

    const navStyle = "border-t-2 border-gray-600 relative -top-0.5"

    const [profileData, setProfileData] = useState(null);
    const [followStatus, setFollowStatus] = useState(null);

    useEffect(() => {
        fetchData();
        // 팔로우, 팔로워 창, 설정 창에서 프로필 페이지로 이동했을 때 모달창을 닫기
        if (ownFollowModal) {
            dispatch(changeOwnFollowModal(ownFollowModal));
        }
        if (ownFollowerModal) {
            dispatch(changeOwnFollowerModal(ownFollowerModal));
        }
        if (otherFollowModal) {
            dispatch(changeOtherFollowModal(otherFollowModal));
        }
        if (otherFollowerModal) {
            dispatch(changeOtherFollowerModal(otherFollowerModal));
        }
        if (profileSettingModal) {
            dispatch(changeProfileSettingModal(profileSettingModal));
        }
    }, [username]); // username을 종속성 배열에 추가

    useEffect(() => {
        fetchData();
    }, [followStatus]);

    useEffect(() => {
        setFollowerCount(followerCount)
    }, [followerCount]);

    // 프로필 데이터 가져오기
    const fetchData = async () => {
        await axios.get(`/profile/${username}`)
            .then(
                response => {
                    const data = response.data;
                    setProfileData(data); // profileData 설정
                    setFollowStatus(data.followStatus); // 팔로우 상태 설정
                    setFollowerCount(data.follower_count);
                    setFollowCount(data.follow_count);
                    console.log(data);
                }
            )
            .catch(
                error => {
                    console.error(error.message);
                }

            )
    }

    // 팔로우하기
    const follow = async (e, target_id) => {
        e.preventDefault();
        await axios.post(`${SERVER}/user/${target_id}/follow/`, null, {
            headers: {
                'Authorization': `${session_key}`
            }
        })
            .then(
                response => {
                    console.log(response.data);
                    let copy = { ...profileData };
                    copy.followStatus = true;
                    setProfileData(copy);
                    setFollowStatus(true);
                }
            )
            .catch(
                error => {
                    console.error(error.message);
                }

            )
    }
    // 언팔로우하기
    const unfollow = async (e, target_id) => {
        e.preventDefault();
        await axios.delete(`${SERVER}/user/${target_id}/follow/`, {
            headers: {
                'Authorization': session_key
            },
        })
            .then(
                response => {
                    console.log(response.data);
                    let copy = { ...profileData };
                    copy.followStatus = false;
                    setProfileData(copy);
                    setFollowStatus(false);
                }
            )
            .catch(
                error => {
                    console.error(error.message);
                }
            );
    }

    // 채팅하기
    const createChat = async (e, target_id) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${SERVER}/chat/`, {
                'user': target_id
            }, {
                'Authorization': session_key
            })
            navigate(`/chat/${response.data.id}`)
        }
        catch (error) {
            console.error(error)
        }
    }

    function MyProfileBtn() {
        let dispatch = useDispatch();

        return (
            <>
                <button class="inline-block px-4 py-2 font-semibold text-sm bg-sesac-green text-white rounded-full shadow-sm" onClick={() => {
                    dispatch(changeVerifyPasswordForEditProfileModal(verifyPasswordForEditProfileModal))
                }}>프로필 수정
                </button>
                <button class="inline-block px-4 py-2 font-semibold text-sm bg-sesac-green text-white rounded-full shadow-sm" onClick={() => {
                    dispatch(changeProfileSettingModal(profileSettingModal))
                }}>설정</button>
            </>
        )
    }
    function OtherProfileBtn({ target_id, followStatus }) {
        return (
            <>
                {
                    followStatus ? (
                        <button
                            class="inline-block px-4 py-2 font-semibold text-sm bg-zinc-400 text-white rounded-full shadow-sm"
                            onClick={(e) => {
                                unfollow(e, target_id);
                            }}>언팔로잉</button>) :
                        (
                            <button
                                class="inline-block px-4 py-2 font-semibold text-sm bg-sesac-green text-white rounded-full shadow-sm"
                                onClick={(e) => {
                                    follow(e, target_id);
                                }}>팔로잉</button>
                        )
                }
                <button
                    class="inline-block px-4 py-2 font-semibold text-sm bg-sesac-green text-white rounded-full shadow-sm"
                    onClick={(e) => {
                        createChat(e, target_id)
                    }
                    }>메시지</button>
            </>
        )
    }


    return (
        // 전체 컨테이너
        <>
            {profileData ? (
                <>
                    <header className="profile_header flex justify-center items-center gap-4 mt-3 mb-5 min-h-full">
                        {/* 프로필 사진 */}
                        <div className="profile_img_container  w-1/6 h-44 ">
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
                        <section className="profile_userinfo_container flex flex-col gap-5 w-6/12 h-44 px-1 ">
                            <div className="flex flex-col gap-3">
                                <div className="profile_userinfo flex">
                                    <div>
                                        <h2 className="inline-block font-bold text-2xl mr-3">{profileData.user_name}</h2>
                                        <span className="inline-block text-sesac-green font-semibold text-sm">{profileData.user_campusname} 캠퍼스</span>
                                    </div>
                                    <div className=" ml-auto flex gap-3">
                                        {profileData.isProfileMine ? <MyProfileBtn /> : <OtherProfileBtn target_id={profileData.user_id} followStatus={profileData.followStatus} />}
                                    </div>
                                </div>
                                <ul className="profile_user_stats flex gap-12 text-slate-600">
                                    <li className="flex gap-2">
                                        <span>게시물</span>
                                        <span className="font-semibold text-black">{profileData.post_count}</span>
                                    </li>
                                    <li>
                                        <Link className="flex gap-2" to='#' onClick={(e) => {
                                            profileData.isProfileMine ? dispatch(changeOwnFollowerModal(ownFollowerModal)) : dispatch(changeOtherFollowerModal(otherFollowerModal))
                                        }
                                        }>
                                            <span>팔로워</span>
                                            <span className="font-semibold text-black">{followerCount == null ? 0 : followerCount}</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="flex gap-2" to='#' onClick={(e) => {
                                            profileData.isProfileMine ? dispatch(changeOwnFollowModal(ownFollowModal)) : dispatch(changeOtherFollowModal(otherFollowModal))
                                        }}>
                                            <span>팔로우</span>
                                            <span className="font-semibold text-black">{followCount == null ? 0 : followCount}</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex flex-col gap-3">
                                {
                                    profileData.content ?
                                        <div className="flex gap-5 text-sm">
                                            <span className="text-sesac-green font-semibold">한줄소개</span>
                                            <span className="text-slate-500">{profileData.content}</span>
                                        </div>
                                        : null
                                }
                                {
                                    profileData.link ?
                                        <div className="flex gap-5 text-sm">
                                            <span className="text-sesac-green font-semibold">링크</span>
                                            <a className="text-slate-500" href={profileData.link}>{profileData.link}</a>
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
                    <div className="profile_nav flex justify-center">
                        {/* 게시물, 좋아요, 댓글 디테일 */}
                        {postClickStatus ? <ProfilePosts user_id={profileData.user_id} /> : null}
                        {likeClickStatus ? <ProfileLikes user_id={profileData.user_id} /> : null}
                        {replyClickStatus ? <ProfileReplys user_id={profileData.user_id} /> : null}
                    </div>

                    {/* Modals */}
                    {verifyPasswordForEditProfileModal && <VerifyPasswordModal url={`/profile/${username}/edit`} modal={verifyPasswordForEditProfileModal} changeModal={changeVerifyPasswordForEditProfileModal} />}
                    {ownFollowModal && <OwnFollowModal user_pk={profileData.user_id} isProfileMine={profileData.isProfileMine} followCount={followCount} setFollowCount={setFollowCount} />}
                    {ownFollowerModal && <OwnFollowerModal user_pk={profileData.user_id} isProfileMine={profileData.isProfileMine} followerCount={followerCount} setFollowerCount={setFollowerCount} />}
                    {otherFollowModal && <OtherFollowModal user_pk={profileData.user_id} isProfileMine={profileData.isProfileMine} followCount={followCount} setFollowCount={setFollowCount} />}
                    {otherFollowerModal && <OtherFollowerModal user_pk={profileData.user_id} isProfileMine={profileData.isProfileMine} followerCount={followerCount} setFollowerCount={setFollowerCount} />}
                    {profileSettingModal && <ProfileSettingModal username={username} />}

                    {/* withdraw */}
                    <Outlet />
                </>
            )
                : (
                    <p>Loading...</p>
                )}</>
    )
}

function ProfileSettingModal({ username }) {
    /* DOM */
    const modalPopup = useRef()
    let dispatch = useDispatch();
    let profileSettingModal = useSelector((state) => state.profileSettingModal)
    let verifyPasswordForWithdrawModal = useSelector((state) => state.verifyPasswordForWithdrawModal)

    /* states */
    const [scroll, setScroll] = useState();

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
        await axios.delete('/accounts/logout/')
        .then(
            response =>  {
                deleteCookie('session_key');
                deleteCookie('username');
                navigate('/accounts/login');
            }
        )
        .catch(
            error =>  {
                console.log(error.response.data);
            }
        )
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
                            closeModal(e);
                            dispatch(changeVerifyPasswordForWithdrawModal(verifyPasswordForWithdrawModal));
                            // navigate(`/profile/${username}/withdraw`);
                        }}>회원탈퇴</button>
                    </li>
                </ul>
            </div>
            {/* Modals */}
            {verifyPasswordForWithdrawModal && <VerifyPasswordModal url={`/profile/${username}/withdraw`} modal={verifyPasswordForWithdrawModal} changeModal={changeVerifyPasswordForWithdrawModal} />}
        </div >
    )
}

export { ProfileLayout, Profile }