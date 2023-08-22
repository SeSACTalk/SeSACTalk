import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import { getCookie } from "../../../modules/handle_cookie";


const ChatDetail = function () {
    // 서버 주소
    const { username } = useParams()
    const SERVER = process.env.REACT_APP_BACK_BASE_URL
    const SERVER_CHAT_DETAIL = `${SERVER}/chat/${username}/`

    // 웹 소켓 주소
    const SERVER_WEB_SOCKET = process.env.REACT_APP_BACK_SOCKET_URL
    const SERVER_CHAT = `${SERVER_WEB_SOCKET}/ws/chat/${username}`

    // 세션키
    const session_key = getCookie('session_key')

    let ws = useRef(null);

    // 상태 선언
    const [socketConnected, setSocketConnected] = useState(false)
    const [sendMsg, setSendMsg] = useState(false);
    const [chat, setChat] = useState('')
    const [items, setItems] = useState([]);

    // 이전 대화내용 DB로부터 가져오기
    useEffect(() => {
        axios.get(SERVER_CHAT_DETAIL, {
            headers: {
                'Authorization': session_key
            }
        })
            .then(
                response => {
                    let copy = [...response.data]
                    setItems(copy)
                }
            )
            .catch(
                error => {
                    console.error(error)
                }
            )
    }, [])

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
                setItems((prevItems) => [...prevItems, data]);
            };
        }
    }, [sendMsg]);

    // 메시지 전송
    const handleChat = (e) => {
        e.preventDefault()
        if (socketConnected) {
            ws.current.send(
                JSON.stringify({
                    content: chat
                })
            )
            setSendMsg(true)
        }
    }
    return (
        // TODO: 사용자의 이름이 items에 들어가야하고, 이전 대화내용이 들어가게해야함
        <div>
            <h4>상세채팅임</h4>
            <ul>
                {
                    items.map((a, i) => {
                        return (
                            <li key={i} className="bg-orange-100">
                                <p>보낸사람:{a.sender__name}</p>
                                <p>내용: {a.content}</p>
                                <p>날짜: {a.date}</p>
                            </li>
                        )
                    })
                }
            </ul>
            <input type="text" name='username' id='username' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' onChange={(e) => setChat(e.target.value)}></input>
            <button type="submit" onClick={handleChat}>전송</button>
        </div>
    )
}

export default ChatDetail