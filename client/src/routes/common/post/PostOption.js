import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getCookie } from "../../../modules/handle_cookie";
import { changeOptionModal, changeReportModal, changeDetailModal } from "../../../store/modalSlice";
import axios from "axios";

const SERVER = process.env.REACT_APP_BACK_BASE_URL;
const session_key = getCookie('session_key')

const PostOption = function ({ detailPath, isPostMine }) {
    /* DOM */
    const modalPopup = useRef()

    /* states */
    const [scroll, setScroll] = useState()
    let optionModal = useSelector((state) => state.optionModal)
    let reportModal = useSelector((state) => state.reportModal)
    let detailModal = useSelector((state) => state.detailModal)
    let dispatch = useDispatch();

    /* SERVER */
    const SERVER_DETAIL_POST = `${SERVER}/post/${detailPath}`

    useEffect(() => {
        setScroll(window.scrollY)
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; }
    }, [scroll])

    const closeModal = (e) => {
        if (modalPopup.current === e.target) {
            dispatch(changeOptionModal(optionModal))
        }
    }

    if (isPostMine) {
        return (
            <div className="modal option_modal flex justify-center items-center absolute left-0 w-full h-screen" style={{ top: scroll }} ref={modalPopup} onClick={closeModal}>
                <div className="absolute flex justify-center items-center rounded-lg w-1/4 h-80 bg-zinc-50">
                    <ul className="post_option flex-row gap-2 w-5/6 h-4/5 bg-zinc-50 border border-solid border-black text-xl">
                        <li className="border-b border-black h-1/4">
                            <button className="block w-full h-full" type="button" onClick={() => {
                                dispatch(changeOptionModal(optionModal))
                                dispatch(changeDetailModal(detailModal))
                            }}>상세보기</button>
                        </li>
                        <li className="border-b border-black h-1/4">
                            <Link className="flex justify-center items-center w-full h-full" to={`/post/${detailPath}/edit`}>수정하기</Link>
                        </li>
                        <li className="border-b border-black h-1/4">
                            <button className="block w-full h-full" type="button" onClick={async (e) => {
                                e.preventDefault();
                                try {
                                    const response = await axios.delete(SERVER_DETAIL_POST, {
                                        headers: {
                                            'Authorization': session_key
                                        }
                                    });
                                    dispatch(changeOptionModal(optionModal))
                                } catch (error) {
                                    console.error(error)
                                }
                            }}>삭제하기</button>
                        </li>
                        <li className="h-1/4">
                            <button className="block w-full h-full" type="button" onClick={() => dispatch(changeOptionModal(optionModal))}>취소하기</button>
                        </li>
                    </ul>
                </div>
            </div >
        )
    } else {
        return (
            <div className="modal post_modal flex justify-center items-center absolute left-0 w-full h-screen" style={{ top: scroll }} ref={modalPopup} onClick={closeModal}>
                <div className="absolute flex justify-center items-center rounded-lg w-1/4 h-80 bg-zinc-50">
                    <ul className="post_option flex-row gap-2 w-5/6 h-4/5 bg-zinc-50 border border-solid border-black text-xl">
                        <li className="border-b border-black h-1/4">
                            <Link className="flex justify-center items-center w-full h-full" to={`/post/${detailPath}`}>상세보기</Link>
                        </li>
                        <li className="border-b border-black h-1/4">
                            <button className="block w-full h-full" type="button" onClick={() => {
                                dispatch(changeOptionModal(optionModal))
                                dispatch(changeReportModal(reportModal))
                            }}>신고하기</button>
                        </li>
                        <li className="h-1/4">
                            <button className="block w-full h-full" type="button" onClick={() => dispatch(changeOptionModal(optionModal))}>취소하기</button>
                        </li>
                    </ul>
                </div>
            </div >
        )
    }

}

export default PostOption
