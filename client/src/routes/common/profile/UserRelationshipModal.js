import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom'

import { changeOwnFollowerModal, changeOwnFollowModal, changeOtherFollowerModal, changeOtherFollowModal } from "../../../store/modalSlice";

const SERVER = process.env.REACT_APP_BACK_BASE_URL;

const OwnFollowerModal = function ({ user_pk, isProfileMine, followerCount, setFollowerCount }) {
    let dispatch = useDispatch();

    /* states */
    const [scroll, setScroll] = useState();
    const [followerList, setFollowerList] = useState([]);

    /* Refs */
    const modalPopup = useRef()
    let ownFollowerModal = useSelector((state) => state.ownFollowerModal)

    useEffect(() => {
        setScroll(window.scrollY)
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';

        }
    }, [scroll])

    useEffect(() => {
        axios.get(`/user/${user_pk}/follower/`).then((response) => {
            setFollowerList(response.data)
        }).catch((error) => {
            console.error(error)
        })
    }, [user_pk, followerCount])

    /**
     * 팔로워 삭제하기
     * @param {Event} e 
     * @param {String} target_id 
     */
    const deleteFollower = async (e, target_id) => {
        e.preventDefault();
        await axios.delete(`/user/${target_id}/follower/`)
            .then(
                response => {
                    setFollowerCount(followerCount - 1);
                }
            )
            .catch(
                error => {
                    console.error(error.message);
                }
            );
    }

    /**
     * 모달창 닫기
     * @param {Event} e 
     */
    const closeModal = (e) => {
        if (modalPopup.current === e.target) {
            dispatch(changeOwnFollowerModal(ownFollowerModal))
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
                            ? <p className="text-center mt-4 text-zinc-400 text-base">팔로워가 없습니다.</p>
                            : followerList.map((element, i) => {
                                return (
                                    <Link to={`/profile/${element.username}`}>
                                        <div className="flex items-center gap-3 px-4 py-2">
                                            <div className="w-[20%] rounded-full overflow-hidden border-2 border-solid border-gray-200">
                                                <img className="w-full h-full p-2" src={`${SERVER + element.profile_img_path}`} />
                                            </div>
                                            <div className="w-[50%] flex flex-col">
                                                <strong className="text-slate-900 text-lg font-medium dark:text-slate-200">{element.name}</strong>
                                                <span className="text-sesac-green text-sm font-medium dark:text-slate-400">{element.campus_name} 캠퍼스</span>
                                            </div>
                                            <div class="w-[30%] flex justify-end">
                                                <button 
                                                    class="inline-block px-4 py-2 font-semibold text-sm bg-zinc-400 text-white rounded-full shadow-sm"  
                                                    onClick={(e)=>{
                                                        deleteFollower(e, element.id);
                                                    }}>삭제</button>
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

const OwnFollowModal = function ({ user_pk, isProfileMine, followCount, setFollowCount }) {
    let dispatch = useDispatch();

    /* States */
    const [scroll, setScroll] = useState();
    const [followList, setFollowList] = useState([]);
    let ownFollowModal = useSelector((state) => state.ownFollowModal)

    /* Refs */
    const modalPopup = useRef()

    useEffect(() => {
        setScroll(window.scrollY)
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';

        }
    }, [scroll])

    useEffect(() => {
        axios.get(`/user/${user_pk}/follow/`)
            .then((response) => {
                console.log(response.data);
                setFollowList(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [user_pk, followCount])

    /**
     * 언팔로우 요청
     * @param {Event} e 
     * @param {String} target_id 
     */
    const unfollow = async (e, target_id) => {
        e.preventDefault();
        await axios.delete(`/user/${target_id}/follow/`)
            .then(
                response => {
                    setFollowCount(followCount - 1);
                }
            )
            .catch(
                error => {
                    console.error(error.message);
                }
            );
    }

    /**
     * 모달창 닫기
     * @param {Event} e 
     */
    const closeModal = (e) => {
        if (modalPopup.current === e.target) {
            dispatch(changeOwnFollowModal(ownFollowModal))
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
                            ? <p className="text-center mt-4 text-zinc-400 text-base">팔로우가 없습니다.</p>
                            : followList.map((element, i) => {
                                return (
                                    <Link to={`/profile/${element.username}`}>
                                        <div className="flex items-center gap-3 px-4 py-2">
                                            <div className="w-[20%] rounded-full overflow-hidden border-2 border-solid border-gray-200">
                                                <img className="w-full h-full p-2" src={`${SERVER + element.profile_img_path}`} />
                                            </div>
                                            <div className="w-[50%] flex flex-col">
                                                <strong className="text-slate-900 text-lg font-medium dark:text-slate-200">{element.name}</strong>
                                                <span className="text-sesac-green text-sm font-medium dark:text-slate-400">{element.campus_name} 캠퍼스</span>
                                            </div>
                                            <div class="w-[30%] flex justify-end">
                                                <button
                                                    class="inline-block px-4 py-2 font-semibold text-sm bg-zinc-400 text-white rounded-full shadow-sm"
                                                    onClick={(e)=>{
                                                        unfollow(e, element.id);
                                                    }}
                                                >취소</button>
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

const OtherFollowerModal = function ({ user_pk, isProfileMine, followerCount, setFollowerCount }) {
    let dispatch = useDispatch();

    /* States */
    const [scroll, setScroll] = useState();
    const [followerList, setFollowerList] = useState([]);
    let otherFollowerModal = useSelector((state) => state.otherFollowerModal);

    /* Refs */
    const modalPopup = useRef();

    useEffect(() => {
        setScroll(window.scrollY)
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';

        }
    }, [scroll])

    useEffect(() => {
        axios.get(`/user/${user_pk}/follower/`).then((response) => {
            setFollowerList(response.data)
        }).catch((error) => {
            console.error(error)
        })
    }, [user_pk, followerCount])

    /**
     * 모달창 닫기
     * @param {Event} e 
     */
    const closeModal = (e) => {
        if (modalPopup.current === e.target) {
            dispatch(changeOtherFollowerModal(otherFollowerModal))
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
                            ? <p className="text-center mt-4 text-zinc-400 text-base">팔로워가 없습니다.</p>
                            : followerList.map((element, i) => {
                                return (
                                    <Link to={`/profile/${element.username}`}>
                                        <div className="flex items-center gap-3 px-4 py-2">
                                            <div className="w-[20%] rounded-full overflow-hidden border-2 border-solid border-gray-200">
                                                <img className="w-full h-full p-2" src={`${SERVER + element.profile_img_path}`} />
                                            </div>
                                            <div className="w-[50%] flex flex-col">
                                                <strong className="text-slate-900 text-lg font-medium dark:text-slate-200">{element.name}</strong>
                                                <span className="text-sesac-green text-sm font-medium dark:text-slate-400">{element.campus_name} 캠퍼스</span>
                                            </div>
                                            <div class="w-[30%] flex justify-end">
                                                <OtherUserRelationshipBtn user_id = {element.id} follow_status = {element.follow_status} is_current_user = {element.is_current_user}/>
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

const OtherFollowModal = function ({ user_pk, isProfileMine, followCount, setFollowCount }) {
    let dispatch = useDispatch();

    /* States */
    const [scroll, setScroll] = useState();
    const [followList, setFollowList] = useState([]);
    let otherFollowModal = useSelector((state) => state.otherFollowModal);

    /* Refs */
    const modalPopup = useRef();

    useEffect(() => {
        setScroll(window.scrollY)
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';

        }
    }, [scroll])

    useEffect(() => {
        axios.get(`/user/${user_pk}/follow/`)
            .then((response) => {
                setFollowList(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [user_pk, followCount])


    /**
     * 모달창 닫기
     * @param {Event} e 
     */
    const closeModal = (e) => {
        if (modalPopup.current === e.target) {
            dispatch(changeOtherFollowModal(otherFollowModal))
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
                            ? <p className="text-center mt-4 text-zinc-400 text-base">팔로우가 없습니다.</p>
                            : followList.map((element, i) => {
                                return (
                                    <Link to={`/profile/${element.username}`}>
                                        <div className="flex items-center gap-3 px-4 py-2">
                                            <div className="w-[20%] rounded-full overflow-hidden border-2 border-solid border-gray-200">
                                                <img className="w-full h-full p-2" src={`${SERVER + element.profile_img_path}`} />
                                            </div>
                                            <div className="w-[50%] flex flex-col">
                                                <strong className="text-slate-900 text-lg font-medium dark:text-slate-200">{element.name}</strong>
                                                <span className="text-sesac-green text-sm font-medium dark:text-slate-400">{element.campus_name} 캠퍼스</span>
                                            </div>
                                            <div class="w-[30%] flex justify-end">
                                                <OtherUserRelationshipBtn user_id = {element.id} follow_status = {element.follow_status} is_current_user = {element.is_current_user}/>
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

function OtherUserRelationshipBtn({ user_id, follow_status, is_current_user }) {
    /* states */
    const [followClickStatus, setFollowClickStatus] = useState(follow_status)

    /* functions */
    let getBtnStyle = (btnColor) => {
        return `inline-block w-16 px-3 py-2 font-semibold text-sm bg-${btnColor} text-white rounded-full shadow-sm`
    }
    let followStyle = getBtnStyle('sesac-green');
    let unfollowStyle = getBtnStyle('zinc-400');

    // 팔로우하기
    const follow = async (e, target_id) => {
        e.preventDefault();
        await axios.post(`/user/${target_id}/follow/`)
            .then(
                response => {
                    console.log(response.data);
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
        await axios.delete(`/user/${target_id}/follow/`)
            .then(
                response => {
                    console.log(response.data);
                }
            )
            .catch(
                error => {
                    console.error(error.message);
                }
            );
    }

    return (
        // 첫 번째 조건(해당 팔로워 / 팔로우가 로그인 유저와 같은지)
        is_current_user ? null :
            // 두 번째 조건(로그인 유저가 팔로우하고 있는지)
            followClickStatus ? (
                <button
                    class={unfollowStyle}
                    onClick={(e) => {
                        setFollowClickStatus(false);
                        unfollow(e, user_id);
                    }}
                >취소</button>
            ) : (
                <button
                    class={followStyle}
                    onClick={(e) => {
                        setFollowClickStatus(true);
                        follow(e, user_id);
                    }}
                >팔로우</button>
            )
    )
}

export { OwnFollowerModal, OwnFollowModal, OtherFollowModal, OtherFollowerModal }