import axios from "axios";
import React, { useState, useEffect } from "react";
import { Outlet, Link } from 'react-router-dom';

import { getCookie } from "../../../modules/handle_cookie";

const SERVER = process.env.REACT_APP_BACK_BASE_URL
const SERVER_CHAT_LIST = `${SERVER}/chat/`
const session_key = getCookie('session_key')
const username = getCookie('username')

const ChatList = function () {

    const [senders, setSender] = useState([])
    let [user, setUser] = useState('')

    useEffect(() => {
        axios.get(SERVER_CHAT_LIST, {
            headers: {
                'Authorization': session_key
            }
        })
            .then(
                response => {
                    setUser(response.data.id)
                    let copy = [...response.data.users]
                    setSender(copy)
                }
            )
            .catch(
                error => {
                    console.error(error)
                }
            )
    }, [])

    return (
        <div className="main_content_container w-1/4 border-r border-gray-300">
            <div className="user_info_wrap relative px-5 mt-14">
                <h4 className="text-2xl font-medium">메시지</h4>
                <div className="img_wrap w-1/4 h-1/4">
                    <img src={`${SERVER}/media/profile/default_profile.png`} alt={username} />
                </div>
                <p>{username}</p>
                <button className="absolute top-0 right-5" type="button">
                    <span className="hidden">대화하기</span>
                    <i className="fa fa-plus-square-o text-3xl" aria-hidden="true"></i>
                </button>
            </div>
            <div className="chat_list_wrap overflow-y-scroll">
                {console.log(senders)}
                {
                    senders.length === 0 ? (
                        <p className="flex justify-center items-center h-96">아직 대화 중인 이웃 새싹이 없어요</p>
                    ) : (
                        <ul className="chat_list flex flex-col gap-2 mt-3">
                            {senders.map((element, i) => (
                                <li className="box-border bg-red-100 p-3" key={i}>
                                    <Link className="flex " to={`${element.sender}`}>
                                        <div className="img_wrap w-1/4 h-1/4">
                                            <img src={`${SERVER}/media/profile/${element.img_path}`} alt={element.sender__name} />
                                        </div>
                                        <div className="chat_info">
                                            <span>{element.sender__name}</span>
                                            <span className="text-sm text-sesac-green">{element.sender__first_course__campus__name}캠퍼스</span>
                                            <p>{element.content}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )
                }
                <Outlet context={{ user }}></Outlet>
            </div>
        </div>
    )
}

export default ChatList