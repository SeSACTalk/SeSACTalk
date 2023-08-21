import React, { useEffect } from "react";
import axios from "axios";
import { getCookie } from "../../modules/handle_cookie";

const Chat = function () {
    const SERVER = process.env.REACT_APP_BACK_BASE_URL
    const SERVER_CHAT_LIST = `${SERVER}/chat/`

    const session_key = getCookie('session_key')

    useEffect(() => {
        axios.get(SERVER_CHAT_LIST, {
            headers: {
                'Authorization': session_key
            }
        })
            .then(
                response => {
                    console.log(response.status)
                }
            )
            .catch(
                error => {
                    console.error(error)
                }
            )
    })
    return (
        <div>
            <h4>채팅리스트</h4>
        </div>
    )

}

export default Chat;