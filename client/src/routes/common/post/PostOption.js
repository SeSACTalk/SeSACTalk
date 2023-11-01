import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

import { changeOptionModal, changeReportModal, changePostEditModal } from "../../../store/modalSlice";

const PostOption = function ({ isPostMine, postInfo }) {
    let dispatch = useDispatch();

    /* States */
    const [scroll, setScroll] = useState()
    let optionModal = useSelector((state) => state.optionModal)
    let reportModal = useSelector((state) => state.reportModal)
    let postEditModal = useSelector((state) => state.postEditModal)
    let detailPath = useSelector((state) => state.detailPath);

    /* Refs */
    const modalPopup = useRef()

    useEffect(() => {
        if (optionModal) {
            dispatch(changeOptionModal(optionModal))
        }
    }, [dispatch, optionModal])

    useEffect(() => {
        setScroll(window.scrollY)
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; }
    }, [scroll])

    /**
     * 모달창 닫기
     * @param {Event} e 
     */
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
                            <Link to={`/post/${postInfo.uuid}`} className="flex justify-center items-center w-full h-full" onClick={() => {
                                dispatch(changeOptionModal(optionModal))
                            }}>상세보기</Link>
                        </li>
                        <li className="border-b border-black h-1/4">
                            <button className="flex justify-center items-center w-full h-full" onClick={() => {
                                dispatch(changeOptionModal(optionModal))
                                dispatch(changePostEditModal(postEditModal))
                            }}>수정하기</button>
                        </li>
                        <li className="border-b border-black h-1/4">
                            <button className="block w-full h-full" type="button" onClick={async (e) => {
                                e.preventDefault();
                                try {
                                    await axios.delete(`/post/${detailPath}`);
                                    dispatch(changeOptionModal(optionModal));
                                    window.location.reload();
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
                            <Link to={`/post/${postInfo.uuid}`} className="flex justify-center items-center w-full h-full" onClick={() => {
                                dispatch(changeOptionModal(optionModal))
                            }}>상세보기</Link>
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