import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";

import { getCookie } from "../../../modules/handleCookie";

import ChatExplore from "./ChatExplore";

/* Cookies */
const username = getCookie('username');

const ChatList = function () {
    /* Server */
    const SERVER = process.env.REACT_APP_BACK_BASE_URL;

    /* States */
    const [target, setTarget] = useState([]);
    const [chatExploreModal, setChatExplore] = useState(false);
    let chatStatus = useSelector((state) => state.chatStatus);

    useEffect(() => {
        axios.get('/chat')
            .then(
                response => {
                    let copy = [...response.data]
                    setTarget(copy)
                }
            )
            .catch(
                error => {
                    console.error(error)
                }
            )
    }, [chatStatus])

    return (
        <div className="main_content_container w-1/4 border-r border-gray-300">
            <div className="user_info_wrap relative px-5 mt-14">
                <h4 className="text-2xl font-medium">메시지</h4>
                <Link to={`/profile/${username}`}>
                    <div className="img_wrap w-1/4 h-1/4">
                        <img src={`${SERVER}/media/profile/default_profile.png`} alt={username} />
                    </div>
                    <p>{username}</p>
                </Link>
                <button className="absolute top-0 right-5" type="button" onClick={() => { setChatExplore(!chatExploreModal) }}>
                    <span className="hidden">대화하기</span>
                    <i className="fa fa-plus-square-o text-3xl" aria-hidden="true"></i>
                </button>
            </div>
            <div className="chat_list_wrap overflow-y-scroll">
                {
                    target.length === 0 ? (
                        <p className="flex justify-center items-center h-96">아직 대화 중인 이웃 새싹이 없어요</p>
                    ) : (
                        <ul className="chat_list flex flex-col gap-2 mt-3">
                            {target.map((element, i) => (
                                <li className="box-border p-2" key={i}>
                                    <Link className="flex items-center gap-3" to={`${element.id}`}>
                                        <div className="img_wrap w-1/5 h-1/5 rounded-full border border-gray-200 overflow-hidden p-1.5">
                                            <img src={SERVER + element.profile_img_path} alt={element.target_name} />
                                        </div>
                                        <div className="sender_info">
                                            <span className="mr-1">{element.target_name}</span>
                                            <span className="font-semibold text-sm text-sesac-green">{
                                                element.target_second_campus_name ?
                                                    element.target_second_campus_name :
                                                    element.target_first_campus_name
                                            } 캠퍼스</span>
                                            <div className="chat_info flex gap-2">
                                                <p className="text-sm text-gray-500">{element.latest_content}</p>
                                                <span className="text-sm text-gray-500">{element.latest_date}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )
                }
            </div>
            {chatExploreModal && <ChatExplore chatExploreModal={chatExploreModal} setChatExplore={setChatExplore} />}
        </div>
    )
}

export default ChatList