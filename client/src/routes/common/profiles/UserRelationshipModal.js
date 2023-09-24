import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom'

import { changeFollowerModal, changeFollowModal } from "../../../store/modalSlice";
import { getCookie } from "../../../modules/handle_cookie";

const SERVER = process.env.REACT_APP_BACK_BASE_URL;
let session_key = getCookie('session_key')

const FollowerModal = function ({ user_pk }) {
    /* DOM */
    const modalPopup = useRef()
    let dispatch = useDispatch();
    let followerModal = useSelector((state) => state.followerModal)

    /* states */
    const [scroll, setScroll] = useState();
    const [followerList, setFollowerList] = useState([]);

    /* SERVER */
    const SERVER_FOLLOWER = `${SERVER}/user/${user_pk}/follower/`

    // window.scroll는 순수 자바스크립트 문법 -> setScroll로 계속 계산
    // document.body.style.overflow = 'hidden';을 없앰
    useEffect(() => {
        setScroll(window.scrollY)
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';

        }
    }, [scroll])

    // follower가져오기
    useEffect(() => {
        axios.get(SERVER_FOLLOWER, {
            headers: {
                'Authorization': session_key
            }
        }).then((response) => {
            console.log(response.data);
            setFollowerList(response.data)
        }).catch((error) => {
            console.error(error)
        })
    }, [])

    const closeModal = (e) => {
        if (modalPopup.current === e.target) {
            dispatch(changeFollowerModal(followerModal))
        }
    }

    return (
        <div className="modal follower_modal flex justify-center items-center absolute left-0 w-full h-screen" style={{ top: scroll }} ref={modalPopup} onClick={closeModal}>
            <div className="detail_container flex flex-col gap-2 justify-items-center items-center rounded-lg w-3/12 h-3/6 max-h-1/2 bg-zinc-50">
                <div className="flex w-full h-[10%] justify-center items-center text-lg mt-3">
                    <p className="text-slate-600 font-semibold ">팔로워</p>
                </div>
                <div className="overflow-auto h-[79%] relative w-11/12 mx-auto bg-white dark:bg-slate-800 dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl flex flex-col divide-y dark:divide-slate-200/5">
                    {
                        followerList.length === 0
                            ? <p className="text-center">팔로워가 없습니다.</p>
                            : followerList.map((element, i) => {
                                return (
                                    <Link to={`/profile/${element.follower_user_username}`}>
                                        <div className="flex items-center gap-3 px-4 py-2">
                                            <div className="w-[20%] rounded-full overflow-hidden border-2 border-solid border-gray-200">
                                                <img className="w-full h-full p-2" src={`${SERVER + element.follower_user_img_path}`} />
                                            </div>
                                            <div className="w-[50%] flex flex-col">
                                                <strong className="text-slate-900 text-lg font-medium dark:text-slate-200">{element.follower_user_name}</strong>
                                                <span className="text-sesac-green text-sm font-medium dark:text-slate-400">{element.follower_user_campusname} 캠퍼스</span>
                                            </div>
                                            <div class="w-[30%] flex justify-end">
                                                <button class="inline-block px-4 py-2 font-semibold text-sm bg-sesac-green text-white rounded-full shadow-sm">팔로잉</button>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            }
                            )
                    }
                </div>
            </div>
        </div>
    )

}

const FollowModal = function ({ user_pk }) {
    /* DOM */
    const modalPopup = useRef()
    let dispatch = useDispatch();
    let followModal = useSelector((state) => state.followModal)

    /* states */
    const [scroll, setScroll] = useState();
    const [followList, setFollowList] = useState([]);

    /* SERVER */
    const SERVER_FOLLOW = `${SERVER}/user/${user_pk}/follow/`

    useEffect(() => {
        setScroll(window.scrollY)
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';

        }
    }, [scroll])

    // follow가져오기
    useEffect(() => {
        axios.get(SERVER_FOLLOW, {
            headers: {
                'Authorization': session_key
            }
        }).then((response) => {
            console.log(response.data);
            setFollowList(response.data)
        }).catch((error) => {
            console.error(error)
        })
    }, [])

    const closeModal = (e) => {
        if (modalPopup.current === e.target) {
            dispatch(changeFollowModal(followModal))
        }
    }

    return (
        <div className="modal follow_modal flex justify-center items-center absolute left-0 w-full h-screen" style={{ top: scroll }} ref={modalPopup} onClick={closeModal}>
            <div className="detail_container flex flex-col gap-2 justify-items-center items-center rounded-lg w-3/12 h-3/6 max-h-1/2 bg-zinc-50">
                <div className="flex w-full h-[10%] justify-center items-center text-lg mt-3">
                    <p className="text-slate-600 font-semibold ">팔로우</p>
                </div>
                <div className="overflow-auto h-[79%] relative w-11/12 mx-auto bg-white dark:bg-slate-800 dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl flex flex-col divide-y dark:divide-slate-200/5">
                    {
                        followList.length === 0
                            ? <p className="text-center">팔로우가 없습니다.</p>
                            : followList.map((element, i) => {
                                return (
                                    <Link to={`/profile/${element.follow_user_username}`}>
                                        <div className="flex items-center gap-3 px-4 py-2">
                                            <div className="w-[20%] rounded-full overflow-hidden border-2 border-solid border-gray-200">
                                                <img className="w-full h-full p-2" src={`${SERVER + element.follow_user_img_path}`} />
                                            </div>
                                            <div className="w-[50%] flex flex-col">
                                                <strong className="text-slate-900 text-lg font-medium dark:text-slate-200">{element.follow_user_name}</strong>
                                                <span className="text-sesac-green text-sm font-medium dark:text-slate-400">{element.follow_user_campusname} 캠퍼스</span>
                                            </div>
                                            <div class="w-[30%] flex justify-end">
                                                <button class="inline-block px-4 py-2 font-semibold text-sm bg-sesac-green text-white rounded-full shadow-sm">팔로잉</button>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            }
                            )
                    }
                </div>
            </div>
        </div>
    )
}

export { FollowerModal, FollowModal }