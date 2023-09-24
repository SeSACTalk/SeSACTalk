import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

const SERVER = process.env.REACT_APP_BACK_BASE_URL

const Notice = function () {
    // 상태
    let noticeNav = useSelector((state) => state.noticeNav);
    const [dataResult, setDataResult] = useState([]);
    const [isNotice, setIsNotice] = useState(true);

    // useEffect(() => {
    //     if (isNotice) { // notice경로로 요청

    //     } else { // 추천게시물 경로로 요청

    //     }
    // }, [isNotice])

    return (
        <div className={`w-[350%] h-screen absolute z-20 left-full top-0 border border-gray-300 p-5 rounded-r-2xl bg-white shadow-min-nav ${noticeNav ? 'animate-intro' : 'hidden'}`}>
            <h2 className="text-2xl my-5">알림</h2>
            <div className="flex justify-evenly border-b border-black p-2 text-xl">
                <button className={`${isNotice ? "text-black" : "text-gray-300"}`}>알림</button>
                <button className={`${isNotice ? "text-gray-300" : "text-black"}`}>추천게시물</button>
            </div>
            <div className="h-4/5 mt-6 overflow-scroll">
                <ul>
                    <li>
                        <Link className="flex items-center gap-4">
                            <span className="text-5xl">1</span>
                            <article className="text-sm">
                                <p>
                                    <span className="text-lg mr-1">사용자명</span>
                                    <span className="text-sm text-sesac-green">캠퍼스명</span>
                                </p>
                                <p>게시글 내용 길면 최대 10자</p>
                                <p className="text-red-300">
                                    <i className="fa fa-heart" aria-hidden="true"></i> 좋아요 10개
                                </p>
                            </article>
                        </Link>
                    </li>
                    <li>
                        <Link className="flex items-center gap-4">
                            <div className="img_wrap w-1/5 h-1/5 rounded-full border border-gray-200 overflow-hidden p-1.5">
                                <img src="" alt="사용자명" />
                            </div>
                            <div className="sender_info">
                                <p>
                                    <span className="text-lg mr-1">사용자명</span>
                                    <span className="text-sm text-gray-500">날짜</span>
                                </p>
                                <div className="chat_info flex gap-2">
                                    <p className="text-sm text-gray-500">내용</p>
                                </div>
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Notice;