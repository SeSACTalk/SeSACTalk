import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getCookie } from "../../../modules/handle_cookie";
import { changeReportModal } from "../../../store/modalSlice";
import '../../../css/modal.css'
import axios from "axios";

const SERVER = process.env.REACT_APP_BACK_BASE_URL
let session_key = getCookie('session_key')

const ReportPost = function ({ postId }) {
    /* DOM */
    const modalPopup = useRef();

    /* states */
    const [scroll, setScroll] = useState()
    let reportModal = useSelector((state) => state.reportModal)
    let dispatch = useDispatch();

    /* SERVER */
    const SERVER_REPORT_POST = `${SERVER}/post/${postId}/report/`

    useEffect(() => {
        setScroll(window.scrollY)
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; }
    }, [scroll])

    /* Functions */
    const reportPost = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(SERVER_REPORT_POST, {
                'content_type': 'post',
                'category': e.target.value
            }, {
                headers: {
                    'Authorization': session_key
                }
            });
        } catch (error) {
            console.error(error)
        } finally {
            dispatch(changeReportModal(reportModal))
        }
    }

    const closeModal = (e) => {
        if (modalPopup.current === e.target) {
            dispatch(changeReportModal(reportModal))
        }
    }


    return (
        <div className="modal report_modal flex justify-center items-center absolute left-0 w-full h-screen" style={{ top: scroll }} ref={modalPopup} onClick={closeModal}>
            <form className='w-1/3 bg-zinc-50 rounded-xl relative'>
                <h2 className="text-center text-xl font-medium p-2 border-b border-gray-400">신고</h2>
                <h3 className="border-b border-gray-300 px-4 py-2">이 게시물을 신고하는 이유</h3>
                <ul className="flex flex-col h-2/3">
                    <li className="h-1/4">
                        <label htmlFor="check-1" className="flex justify-between cursor-pointer px-4 py-2">
                            <span>사행성</span>
                            <i className="fa fa-angle-right text-xl" aria-hidden="true"></i>
                        </label>
                        <input id="check-1" className="hidden" type="checkbox" value="사행성" onClick={reportPost} />
                    </li>
                    <li className="h-1/4">
                        <label htmlFor="check-2" className="flex justify-between cursor-pointer px-4 py-2">
                            <span>스팸</span>
                            <i className="fa fa-angle-right text-xl" aria-hidden="true"></i>
                        </label>
                        <input id="check-2" className="hidden" type="checkbox" value="스팸" onClick={reportPost} />
                    </li>
                    <li className="h-1/4">
                        <label htmlFor="check-3" className="flex justify-between cursor-pointer px-4 py-2">
                            <span>나체 또는 성적행위 이미지</span>
                            <i className="fa fa-angle-right text-xl" aria-hidden="true"></i>
                        </label>
                        <input id="check-3" className="hidden" type="checkbox" value="나체 또는 성적행위 이미지" onClick={reportPost} />
                    </li>
                    <li className="h-1/4">
                        <label htmlFor="check-4" className="flex justify-between cursor-pointer px-4 py-2">
                            <span>혐오 발언 또는 상징</span>
                            <i className="fa fa-angle-right text-xl" aria-hidden="true"></i>
                        </label>
                        <input id="check-4" className="hidden" type="checkbox" value="혐오 발언 또는 상징" onClick={reportPost} />
                    </li>
                    <li className="h-1/4">
                        <label htmlFor="check-5" className="flex justify-between cursor-pointer px-4 py-2">
                            <span>거짓 정보</span>
                            <i className="fa fa-angle-right text-xl" aria-hidden="true"></i>
                        </label>
                        <input id="check-5" className="hidden" type="checkbox" value="거짓 정보" onClick={reportPost} />
                    </li>
                </ul>
                <button className="absolute top-1 right-2 text-2xl text-gray-400" type="button" onClick={() => {
                    dispatch(changeReportModal(reportModal))
                }}>
                    <i className="fa fa-times" aria-hidden="true"></i>
                    <span className="hidden">취소하기</span>
                </button>
            </form>
        </div>
    )
}

export default ReportPost