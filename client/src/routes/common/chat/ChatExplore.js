import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const ChatExplore = function ({ chatExploreModal, setChatExplore }) {
    let navigate = useNavigate();

    /* Server */
    const SERVER = process.env.REACT_APP_BACK_BASE_URL;

    /* States */
    const [explore, setExplore] = useState('');
    const [exploreResult, setExploreResult] = useState([]);

    /* Refs */
    const modalPopup = useRef();

    useEffect(() => {
        if (explore.length > 0) {
            getExploreResult(explore);
        }
        return () => {
            setExploreResult([])
        }
    }, [explore])

    /**
     * 모달창 닫는 함수
     * @param {Event} e 
     */
    const closeModal = (e) => {
        if (modalPopup.current === e.target) {
            setChatExplore(!chatExploreModal)
        }
    }
    /**
     * 인풋에 입력된 데이터를 통해 서버로부터 결과를 가져온다.
     * @param {string} data - 인풋에 입력된 데이터
     */
    const getExploreResult = async (data) => {
        try {
            const response = await axios.get(`/explore/user?name=${data}`);
            let copy = [...response.data]
            setExploreResult(copy)
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * 채팅방 생성 및 생성한 채팅방으로 이동하는 함수
     * @param {number} target_id 
     */
    const createChat = async (target_id) => {
        try {
            const response = await axios.post(`/chat/`, {
                'user': target_id
            })
            setChatExplore(!chatExploreModal)
            navigate(`/chat/${response.data.id}`)
        }
        catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="modal post_modal flex justify-center items-center absolute left-0 w-full h-screen top-0" ref={modalPopup} onClick={closeModal}>
            <div className="absolute flex flex-col justify-center items-center rounded-lg w-1/2 h-1/2 bg-zinc-50">
                <div className="input_wrap flex w-5/6 bg-gray-200 rounded-3xl">
                    <input className="w-full px-3 py-2 bg-gray-200 rounded-3xl outline-none" type="text" onChange={(e) => { setExplore(e.target.value.trim()) }} />
                    <button className="w-10 outline-none" onClick={(e) => { setExplore('') }}>
                        <span className="hidden">닫기</span>
                        <i className="fa fa-times text-xl text-gray-400" aria-hidden="true"></i>
                    </button>
                </div>
                <div className="post_option flex-row gap-2 w-5/6 h-4/5 px-2 py-3 overflow-auto">
                    <ul>
                        {exploreResult.map((element, i) => {
                            return (
                                <li className="cursor-pointer mb-3"
                                    onClick={(e) => { createChat(element.id) }}
                                    key={i}>
                                    <div className="result_info flex items-center h-20 p-1 gap-5">
                                        <div className="img_wrap w-16 h-16 rounded-full overflow-hidden border border-solid border-gray-200 p-1">
                                            <img src={SERVER + element.profile_img_path} alt={element.name} />
                                        </div>
                                        <p className="flex flex-col">
                                            <span>{element.name}</span>
                                            <span className="flex items-end gap-3 text-sm">
                                                <span className="text-gray-500">{element.username}</span>
                                                <span className="font-semibold text-sesac-green">{element.campus_name} 캠퍼스</span>
                                            </span>
                                        </p>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </div >
    )
}

export default ChatExplore