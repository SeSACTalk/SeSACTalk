import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { setDetailPath } from "../../store/postSlice";

const Notice = function () {
    // 상태
    const [dataResult, setDataResult] = useState([]);
    const [isNotice, setIsNotice] = useState(true);
    let noticeNav = useSelector((state) => state.noticeNav);

    let dispatch = useDispatch();

    useEffect(() => {
        if (isNotice) { // notice경로로 요청
            return
        } else { // 추천게시물 경로로 요청
            axios.get(`/post/recommend/`)
                .then(
                    response => {
                        let copy = [...response.data];
                        setDataResult(copy);
                    }
                )
                .catch(
                    error => console.error(error)
                )
        }
        return () => {
            setDataResult([]);
        }
    }, [isNotice])

    return (
        <div className={`w-[350%] h-screen absolute z-20 left-full top-0 border border-gray-300 p-5 rounded-r-2xl bg-white shadow-min-nav ${noticeNav ? 'animate-intro' : 'hidden'}`}>
            <h2 className="text-2xl my-5">알림</h2>
            <div className="flex justify-evenly border-b border-black p-2 text-xl">
                <button className={`${isNotice ? "text-black" : "text-gray-300"}`} onClick={(e) => {
                    setIsNotice(!isNotice)
                }}>알림</button>
                <button className={`${isNotice ? "text-gray-300" : "text-black"}`} onClick={(e) => {
                    setIsNotice(!isNotice)
                }}>추천게시물</button>
            </div>
            <div className="h-4/5 mt-6 overflow-scroll">
                <ul>
                    {
                        dataResult.map((element, i) => {
                            if (isNotice) {
                                return (
                                    <li key={i}>
                                        <Link to="#" className="flex items-center gap-4">
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
                                )
                            } else {
                                return (
                                    <li className="mb-3" key={i}>
                                        <Link
                                            to={`/post/${element.uuid}`}
                                            className="flex items-center gap-4"
                                            onClick={(e) => {
                                                dispatch(setDetailPath(`${element.username}/${element.id}`))
                                            }}
                                        >
                                            <span className="flex justify-center w-1/6 text-5xl text-gray-500">{i + 1}</span>
                                            <article className="text-sm">
                                                <p>
                                                    <span className="text-lg mr-1">{element.name}</span>
                                                    <span className="text-sm text-sesac-green">{element.campus_name} 캠퍼스</span>
                                                </p>
                                                <p>{element.content.length > 10 ? element.content.slice(0, 10) : element.content}</p>
                                                <p className="text-red-300">
                                                    <i className="fa fa-heart" aria-hidden="true"></i> 좋아요 {element.like}개
                                                </p>
                                            </article>
                                        </Link>
                                    </li>
                                )
                            }

                        })
                    }
                </ul>
            </div>
        </div>
    )
}

export default Notice;