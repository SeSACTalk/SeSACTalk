import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { getCookie } from "../../../modules/handle_cookie";


const ChatDetail = function () {
    const { username } = useParams()
    const SERVER = process.env.REACT_APP_BACK_BASE_URL
    const SERVER_CHAT_DETAIL = `${SERVER}/chat/${username}/`

    const session_key = getCookie('session_key')

    const [chats, setChat] = useState([])

    useEffect(() => {
        axios.get(SERVER_CHAT_DETAIL, {
            headers: {
                'Authorization': session_key
            }
        })
            .then(
                response => {
                    let copy = [...response.data]
                    setChat(copy)
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
            <h4>상세페이지임</h4>
            <table>
                {
                    chats.map((a, i) => {
                        return (
                            <tbody key={i}>
                                <tr>
                                    <td>{a.sender__name}</td>
                                </tr>
                                <tr>
                                    <td>{a.content}</td>
                                </tr>
                            </tbody>
                        )
                    })
                }
            </table>
        </div>
    )
}

export default ChatDetail