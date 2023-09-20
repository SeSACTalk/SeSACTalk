import React, { useState, useEffect } from "react";
import axios from "axios";

const SERVER = process.env.REACT_APP_BACK_BASE_URL;

const Explore = function () {
    return (
        <div className="w-[350%] h-screen absolute z-20 top-0 left-[100%] border border-gray-300 p-5 rounded-r-2xl shadow-min-nav">
            <h2 className="text-2xl my-5">검색</h2>
            <div className="search_wrap relative">
                <input className="w-full ps-2 pe-5 py-1.5 bg-gray-100 rounded-lg" type="text" placeholder="이웃 새싹 / 새싹태그 검색" />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2">
                    <span className="hidden">닫기</span>
                    <i className="fa fa-times text-gray-400" aria-hidden="true"></i>
                </button>
            </div>
            <div className="h-4/5 bg-red-100 mt-6 overflow-scroll">
                <ul>
                    <li>
                        <div className="chat_user_info flex items-center h-20 p-1 gap-5 border-b border-gray-200">
                            <div className="img_wrap w-16 h-16 rounded-full overflow-hidden border border-solid border-gray-200 p-1">
                                <img src={SERVER} alt="" />
                            </div>
                            <p className="flex flex-col">
                                <span>hi</span>
                                <span className="flex items-end gap-3 text-sm">
                                    <span className="text-gray-500">""</span>
                                    {/* {
                                        profile.second_campus_name ?
                                            <span className="font-semibold text-sesac-green">{profile.second_campus_name} 캠퍼스</span> :
                                            <span className="font-semibold text-sesac-green">{profile.first_campus_name} 캠퍼스</span>
                                    } */}
                                </span>
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Explore