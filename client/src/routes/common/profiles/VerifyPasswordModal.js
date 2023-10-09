import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js'

import { getCookie } from "../../../modules/handle_cookie";

import { changeProfileSettingModal } from "../../../store/modalSlice";

const SERVER = process.env.REACT_APP_BACK_BASE_URL;
let session_key = getCookie('session_key')

const VerifyPassword = function ({ url, modal, changeModal }) {
    /* DOM */
    const modalPopup = useRef()
    let dispatch = useDispatch();
    let profileSettingModal = useSelector((state) => state.profileSettingModal)
    // let verifyPasswordModal = useSelector((state) => state.verifyPasswordModal)

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
        e.preventDefault()
        const hashedPw = CryptoJS.SHA256(password).toString();
        await axios.post(SERVER_VERIFY_PASSWORD_POST, { password: hashedPw, }, {
            headers: {
                'Authorization': session_key
            },
        })
            .then(response => {
                dispatch(changeModal(modal));
                navigate(`${url}`);
            })
            .catch(error => {
                // 잘못된 접근
                setIsPasswordMatch(false);
                console.log(error.response.data);
            });
    }

    const closeModal = (e) => {
        if (modalPopup.current === e.target) {
            if (profileSettingModal) {
                dispatch(changeProfileSettingModal(profileSettingModal));
            }
            dispatch(changeModal(modal))
        }
    }

    return (
        <div className="modal verify_password_modal flex justify-center items-center absolute left-0 w-full h-screen" style={{ top: scroll }} ref={modalPopup} onClick={closeModal}>
            <div className={`detail_container flex gap-5 justify-center rounded-lg w-3/12 h-[34%] p-5 bg-zinc-50 ${isPasswordMatch ? '' : 'animate-spin-shake'}`}>
                <div className="w-5/6">
                    <div className="flex flex-col gap-5 h-[88%] justify-between items-center text-sm">
                        <span className="text-gray-500 text-base font-semibold">비밀번호 확인</span>
                        <form className="flex flex-col justify-between items-center h-28">
                            <div>
                                <input 
                                    type="password" 
                                    name="password" 
                                    className="mt-1 px-3 py-2 italic text-center bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sesac-sub focus:ring-sesac-sub block w-full rounded-md sm:text-sm focus:ring-1"
                                    placeholder="비밀번호를 입력해주세요"
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            requestToVerifyPassword(e, password);
                                        }
                                    }
                                    }
                                ></input>

                                {/* 비밀번호를 잘못 입력했을 때
                                  <input type="text" id="error" class="bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" placeholder="Error input">
  <p class="mt-2 text-sm text-red-600 dark:text-red-500"><span class="font-medium">Oh, snapp!</span> Some error message.</p> */}
                            </div>
                            <button className="w-8/12 px-4 py-2 font-semibold text-sm bg-sesac-green text-white rounded-full shadow-sm" type="button" onClick={
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