import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom"
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { showMinNav, showExploreNav } from "../../store/navSlice";

const SERVER = process.env.REACT_APP_BACK_BASE_URL;

const Explore = function () {
    // 상태
    const [explore, setExplore] = useState('');
    const [exploreResult, setExploreResult] = useState([]);
    let minNav = useSelector((state) => state.minNav);
    let exploreNav = useSelector((state) => state.exploreNav);

    let dispatch = useDispatch();

    // DOM
    const input = useRef();

    // 태그 검색
    const exploreByTag = async (content) => {
        try {
            const response = await axios.get(`/explore/tag?name=${content}`)
            let copy = [...response.data]
            setExploreResult(copy)
        }
        catch (error) {
            console.error(error)
        }
    }

    // 사용자 검색
    const exploreByUser = async (content) => {
        try {
            const response = await axios.get(`/explore/user?name=${content}`)
            let copy = [...response.data]
            setExploreResult(copy)
        } catch (error) {
            console.error(error)
        }
    }


    // 검색
    useEffect(() => {
        // 공백제거
        const exploreContent = explore.replace(/\s/g, '');
        if (exploreContent.charAt(0) === '#') {
            let content = exploreContent.slice(1, exploreContent.length)
            if (content.length > 0) {
                exploreByTag(content)
            }
        } else {
            if (exploreContent.length > 0) {
                exploreByUser(exploreContent)
            }
        }

        return () => {
            setExploreResult([])
        }
    }, [explore])

    // 모달창 제어
    const handleSubNav = () => {
        // minNav이 활성화상태일때만 닫혀야함
        minNav && dispatch(showMinNav(minNav));
        // minNav가 true일때만 같이 보여야하고, false이면 false로
        if (minNav && exploreNav) {
            dispatch(showExploreNav(exploreNav))
        }
    }

    return (
        <div className={`w-[350%] h-screen absolute z-20 top-0 left-full border border-gray-300 p-5 rounded-r-2xl bg-white shadow-min-nav ${exploreNav ? 'animate-intro' : 'hidden'}`}>
            <h2 className="text-2xl my-5">검색</h2>
            <div className="search_wrap relative">
                <input
                    className="w-full ps-2 pe-5 py-1.5 bg-gray-100 rounded-lg"
                    type="text"
                    placeholder="이웃 새싹 / 새싹태그 검색"
                    onChange={(e) => {
                        setExplore(e.target.value.trim())
                    }}
                    ref={input}
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2"
                    onClick={(e) => {
                        setExplore('');
                        input.current.value = '';
                    }}>
                    <span className="hidden">닫기</span>
                    <i className="fa fa-times text-gray-400" aria-hidden="true"></i>
                </button>
            </div>
            <div className="h-4/5 mt-6 overflow-scroll">
                {
                    exploreResult.length > 0 ?
                        exploreResult.map((element, i) => {
                            if (element.campus_name) {
                                return ( // 사용자 검색
                                    <ul className="overflow-x-hidden" key={i}>
                                        <li className="mb-1">
                                            <Link
                                                to={`/profile/${element.username}`}
                                                className="chat_user_info flex items-center h-20 p-1 gap-5"
                                            >
                                                <div className="img_wrap w-16 h-16 rounded-full overflow-hidden border border-gray-200 p-1">
                                                    <img src={`${element.is_staff ? (process.env.PUBLIC_URL + "/img/logo.png") : (SERVER + element.profile_img_path)}`} />
                                                </div>
                                                <p className="flex flex-col">
                                                    {
                                                        element.is_staff ? (
                                                            <span className="font-semibold text-sesac-green">{element.campus_name} 캠퍼스</span>
                                                        ) :
                                                            (

                                                                <><span>{element.name}</span>
                                                                    <span className="flex items-end gap-3 text-sm">
                                                                        <span className="text-gray-500">{element.username}</span>
                                                                        <span className="font-semibold text-sesac-green">{element.campus_name} 캠퍼스</span>
                                                                    </span></>
                                                            )
                                                    }

                                                </p>
                                            </Link>
                                        </li>
                                    </ul>
                                )
                            } else {
                                return ( // 태그검색
                                    <ul className="overflow-x-hidden" key={i}>
                                        <li className="mb-1">
                                            <Link
                                                to={`/explore/${element.name}`}
                                                className="chat_user_info flex items-center h-20 p-1 gap-5"
                                                onClick={(e) => {
                                                    handleSubNav()
                                                }}>
                                                <div className="flex justify-center items-center w-16 h-16 rounded-full overflow-hidden border border-gray-300  bg-gray-200 p-1">
                                                    <i className="fa fa-hashtag text-xl" aria-hidden="true"></i>
                                                </div>
                                                <p className="flex flex-col">
                                                    <span>{element.name}</span>
                                                    <span className="flex items-end gap-3 text-sm">
                                                        <span className="font-semibold text-sesac-green">{element.count_post}개 게시물</span>
                                                    </span>
                                                </p>
                                            </Link>
                                        </li>
                                    </ul>
                                )
                            }
                        })
                        :
                        <div className="flex justify-center items-center h-1/2">
                            <p>검색 결과 없음</p>
                        </div>
                }
            </div>
        </div >
    )
}

export default Explore