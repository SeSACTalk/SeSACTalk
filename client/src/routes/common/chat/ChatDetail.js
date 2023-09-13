import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import { getCookie } from "../../../modules/handle_cookie";


const ChatDetail = function () {
    // DOM
    const chatInput = useRef();

    // 서버 주소
    const { chatRoom } = useParams();

    const SERVER = process.env.REACT_APP_BACK_BASE_URL
    const SERVER_CHAT_DETAIL = `${SERVER}/chat/${chatRoom}`

    // 웹 소켓 주소
    const SERVER_WEB_SOCKET = process.env.REACT_APP_BACK_SOCKET_URL
    const SERVER_CHAT = `${SERVER_WEB_SOCKET}/ws/chat/${chatRoom}`

    // 세션키
    const session_key = getCookie('session_key')

    let ws = useRef(null);

    // 상태 선언
    const [socketConnected, setSocketConnected] = useState(false);
    const [sendMsg, setSendMsg] = useState(false);
    const [chat, setChat] = useState('');
    const [sender, setSender] = useState('');
    const [chatDetail, setChatDetail] = useState([]);
    const [profile, setProfile] = useState({})

    // 이전 대화내용 DB로부터 가져오기
    useEffect(() => {
        axios.get(SERVER_CHAT_DETAIL, {
            headers: {
                'Authorization': session_key
            }
        })
            .then(
                response => {
                    let copy = { ...response.data };
                    setSender(parseInt(copy.id))
                    setChatDetail(copy.chat)
                    setProfile(copy.profile)
                }
            )
            .catch(
                error => {
                    console.error(error)
                }
            )
    }, [sendMsg])

    // 소켓 객체 생성
    useEffect(() => {
        if (!ws.current) {
            ws.current = new WebSocket(SERVER_CHAT);
            ws.current.onopen = () => {
                console.log('connect to' + SERVER_CHAT)
                setSocketConnected(true)
            }
        }
    }, [])

    // send 후에 onmessage로 데이터 가져오기
    useEffect(() => {
        if (sendMsg) {
            ws.current.onmessage = (evt) => {
                const data = JSON.parse(evt.data);
                setChatDetail((prevItems) => [...prevItems, data]);
            };
        }
    }, [sendMsg]);

    // 메시지 전송
    const handleChat = (e) => {
        e.preventDefault();
        if (socketConnected) {
            ws.current.send(
                JSON.stringify({
                    sender: sender,
                    content: chat
                })
            )
            setSendMsg(true)
            chatInput.current.value = ''
        }
    }

    return (
        <div className="w-[calc(75%-6rem)] h-screen">
            <h4 className="hidden">상세채팅</h4>
            {
                profile && <div className="chat_user_info flex items-center h-20 p-1 gap-5 border-b border-gray-200">
                    <div className="img_wrap w-16 h-16 rounded-full overflow-hidden border border-solid border-gray-200 p-1">
                        <img src={SERVER + profile.profile_img_path} alt={profile.name} />
                    </div>
                    <p className="flex flex-col">
                        <span>{profile.name}</span>
                        <span className="flex items-end gap-3 text-sm">
                            <span className="text-gray-500">{profile.username}</span>
                            {
                                profile.second_campus_name ?
                                    <span className="font-semibold text-sesac-green">{profile.second_campus_name} 캠퍼스</span> :
                                    <span className="font-semibold text-sesac-green">{profile.first_campus_name} 캠퍼스</span>
                            }

                        </span>
                    </p>
                </div>
            }

            <div className="h-[calc(100%-9rem)] overflow-y-scroll px-6">
                <ul>
                    {
                        chatDetail.map((element, i) => {
                            if (element.sender != sender) {
                                return (
                                    <li key={i} className="flex items-center gap-4 mb-3">
                                        <p className="text-start">
                                            <span className="text inline-block bg-gray-200 px-2 py-1 text-sm rounded-lg"> {element.content}</span>
                                            <span className="date block text-xs mt-1">{element.date}</span>
                                        </p>
                                    </li>
                                )
                            }
                            return (
                                <li key={i} className="flex justify-end items-center gap-4 mb-3">
                                    <p className="text-end">
                                        <span className="inline-block text bg-sesac-green px-2 py-1 rounded-lg text-sm text-white"> {element.content}</span>
                                        <span className="date block text-xs mt-1">{element.date}</span>
                                    </p>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className="chat_input_container h-16 p-3">
                <div className="chat_input w-full h-full border border-gray-200 px-2 py-1 rounded-lg">
                    <input className='inline-block w-[calc(100%-2rem)] h-full' type="text" onChange={(e) => setChat(e.target.value)} ref={chatInput} />
                    <button className="inline-block w-8" type="submit" onClick={handleChat}>
                        <span className="hidden">전송</span>
                        <i className="fa fa-paper-plane-o text-xl font-semibold text-sesac-green" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatDetail