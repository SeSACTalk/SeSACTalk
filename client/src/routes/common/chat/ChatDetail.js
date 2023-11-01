import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { changeStatus } from "../../../store";

const ChatDetail = function () {
    let dispatch = useDispatch();
    const { chatRoom } = useParams();

    /* Server */
    const SERVER = process.env.REACT_APP_BACK_BASE_URL;
    const SERVER_WEB_SOCKET = process.env.REACT_APP_BACK_SOCKET_URL
    const SERVER_CHAT = `${SERVER_WEB_SOCKET}/ws/chat/${chatRoom}`


    /* States */
    const [socketConnected, setSocketConnected] = useState(true);
    const [sendMsg, setSendMsg] = useState(false);
    const [chat, setChat] = useState('');
    const [sender, setSender] = useState('');
    const [chatDetail, setChatDetail] = useState([]);
    const [profile, setProfile] = useState({})
    let chatStatus = useSelector((state) => state.chatStatus);

    /* Refs */
    let ws = useRef(null);
    const chatInput = useRef();
    const chatSubmit = useRef();
    const scrollRef = useRef();

    useEffect(() => {
        axios.get(`/chat/${chatRoom}`)
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
    }, [sendMsg, chatRoom])

    // 소켓 객체 생성
    useEffect(() => {
        if (socketConnected) {
            ws.current = new WebSocket(SERVER_CHAT);

            ws.current.onopen = () => {
                setSocketConnected(true)
            }

            ws.current.onclose = (error) => {
                setSocketConnected(false)
            };
        }

        return () => {
            if (ws.current) {
                setSocketConnected(false)
            }
        }
    }, [chatRoom, socketConnected, SERVER_CHAT])

    // send 후에 onmessage로 데이터 가져오기
    useEffect(() => {
        if (sendMsg) {
            ws.current.onmessage = (evt) => {
                setSendMsg(!sendMsg)
            }
        }
    }, [sendMsg]);

    // 스크롤 가장아래로
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatDetail]);

    /**
     * 메시지 전송
     */
    const handleChat = () => {
        if (socketConnected) {
            ws.current.send(
                JSON.stringify({
                    sender: sender,
                    content: chat
                })
            )
            setSendMsg(!sendMsg)
            dispatch(changeStatus(chatStatus))
        }
    }

    return (
        <div className="w-3/4 h-screen">
            <h4 className="hidden">상세채팅</h4>
            {
                profile && <div className="h-20 p-1 border-b border-gray-200">
                    <Link to={`/profile/${profile.username}`} className="flex items-center gap-5">
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
                    </Link>
                </div>
            }
            <div className="h-[calc(100%-9rem)] overflow-y-scroll px-6" ref={scrollRef}>
                <ul>
                    {
                        chatDetail.map((element, i) => {
                            if (element.sender !== sender) {
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
                    <input className='inline-block w-[calc(100%-2rem)] h-full'
                        type="text"
                        value={chat}
                        onChange={
                            (e) => setChat(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                chatSubmit.current.click()
                                setChat('')
                            }
                            if (e.nativeEvent.isComposing) return;
                        }}
                        ref={chatInput} />
                    <button className="inline-block w-8" type="submit" onClick={(e) => {
                        e.preventDefault();
                        handleChat()
                    }} ref={chatSubmit}>
                        <span className="hidden">전송</span>
                        <i className="fa fa-paper-plane-o text-xl font-semibold text-sesac-green" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatDetail