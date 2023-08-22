import React, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, Link } from 'react-router-dom';


import { getCookie } from "../../../modules/handle_cookie";

const Chat = function () {
    const SERVER = process.env.REACT_APP_BACK_BASE_URL
    const SERVER_CHAT_LIST = `${SERVER}/chat/`

    const session_key = getCookie('session_key')
    const [senders, setSender] = useState([])

    useEffect(() => {
        axios.get(SERVER_CHAT_LIST, {
            headers: {
                'Authorization': session_key
            }
        })
            .then(
                response => {
                    let copy = [...response.data]
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
        <div>
            <h4>채팅리스트</h4>
            {
                senders.map((a, i) => {
                    return (
                        <Link to={`${a.sender}`} key={i}>{a.sender__name}</Link>
                    )
                })
            }
            <Outlet></Outlet>
        </div>
    )

}

export default Chat;