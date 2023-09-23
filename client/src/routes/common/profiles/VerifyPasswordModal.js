import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js'

import { changeVerifyPasswordModal } from "../../../store/modalSlice";
import { getCookie } from "../../../modules/handle_cookie";

const SERVER = process.env.REACT_APP_BACK_BASE_URL;
let session_key = getCookie('session_key')

const VerifyPassword = function ({ url }) {
    /* DOM */
    const modalPopup = useRef()
    let dispatch = useDispatch();
    let verifyPasswordModal = useSelector((state) => state.verifyPasswordModal)

    /* states */
    const [scroll, setScroll] = useState();
    const [isPasswordMatch, setIsPasswordMatch] = useState(true);
    const [password, setPassword] = useState('');

    const navigate = useNavigate()

    /* SERVER */
    const SERVER_VERIFY_PASSWORD_POST = `${SERVER}/accounts/verify/password/`

    // window.scroll는 순수 자바스크립트 문법 -> setScroll로 계속 계산
    // document.body.style.overflow = 'hidden';을 없앰
    useEffect(() => {
        setScroll(window.scrollY)
        document.body.style.overflow = 'hidden';
        return () => { 
            document.body.style.overflow = 'unset'; 

        }
    }, [scroll])

    //  axios

    const requestToVerifyPassword = async (e, password) => { /* 비밀번호 확인 */
        const hashedPw = CryptoJS.SHA256(password).toString();
        await axios.post(SERVER_VERIFY_PASSWORD_POST, { password: hashedPw, }, {
            headers: {
                'Authorization': session_key
            },
        })
            .then(response => {
                dispatch(changeVerifyPasswordModal(verifyPasswordModal));
                navigate(url);
            })
            .catch(error => {
                // 잘못된 접근
                setIsPasswordMatch(false);
                console.log(error.response.data);
            });
    }

    const closeModal = (e) => {
        if (modalPopup.current === e.target) {
            dispatch(changeVerifyPasswordModal(verifyPasswordModal))
        }
    }

    return (
        <div className="modal detail_modal flex justify-center items-center absolute left-0 w-full h-screen" style={{ top: scroll }} ref={modalPopup} onClick={closeModal}>
            <div className={`detail_container flex gap-5 justify-center rounded-lg w-3/12 h-2/6 p-5 bg-zinc-50 ${isPasswordMatch ? '' : 'animate-spin-shake'}`}>
                <div className="w-5/6">
                    <div className="flex flex-col gap-6 justify-center items-center text-sm">
                        <span className="text-gray-500 text-base font-semibold">비밀번호 확인</span>
                        <form className="flex flex-col gap-8">
                            <div>
                                <input
                                    className="bg-transparent outline-sesac-green text-center placeholder:italic placeholder:text-slate-400"
                                    type="password"
                                    name="password"
                                    placeholder="비밀번호를 입력해주세요"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button className="px-4 py-2 font-semibold text-sm bg-sesac-green text-white rounded-full shadow-sm" type="button" onClick={
                                (e) => {
                                    requestToVerifyPassword(e, password);
                                }
                            }>확인</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerifyPassword