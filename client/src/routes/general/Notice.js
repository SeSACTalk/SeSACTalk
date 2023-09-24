import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const SERVER = process.env.REACT_APP_BACK_BASE_URL

const Notice = function () {
    // 상태
    let noticeNav = useSelector((state) => state.noticeNav);
    const [dataResult, setDataResult] = useState([]);
    const [isNotice, setIsNotice] = useState(true);

    return (
        <div className={`w-[350%] h-screen absolute z-20 left-full top-0 border border-gray-300 p-5 rounded-r-2xl bg-white shadow-min-nav ${noticeNav ? 'animate-intro' : 'hidden'}`}>
            <h2 className="text-2xl my-5">알림</h2>
            <div className="flex justify-evenly border-b border-black text-xl">
                <button>알림</button>
                <button>추천게시물</button>
            </div>
            <div className="h-4/5 mt-6 overflow-scroll">
                <ul>
                    <li className="flex items-center gap-4">
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
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Notice;