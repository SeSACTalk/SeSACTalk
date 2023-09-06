import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { changeDetailModal } from "../../../store/modalSlice";
import { getCookie } from "../../../modules/handle_cookie";

const SERVER = process.env.REACT_APP_BACK_BASE_URL;
let session_key = getCookie('session_key')

const PostDetail = function ({ detailPath, isPostMine }) {
    /* DOM */
    const modalPopup = useRef()

    /* states */
    const [scroll, setScroll] = useState()
    const [post, setPost] = useState()
    const [imgPath, setImgPath] = useState()
    let detailModal = useSelector((state) => state.detailModal)
    let dispatch = useDispatch()

    /* SERVER */
    const SERVER_DETAIL_POST = `${SERVER}/post/${detailPath}?request_post`

    useEffect(() => {
        setScroll(window.scrollY)
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; }
    }, [scroll])

    useEffect(() => { // TODO: 데이터 바인딩해야함
        axios.get(SERVER_DETAIL_POST, {
            headers: {
                'Authorization': session_key
            }
        }).then((response) => {
            let copy = { ...response.data.post }
            setPost(copy)
            setImgPath(copy.img_path)
        }).catch((error) => {
            console.error(error)
        })
    }, [])

    const closeModal = (e) => {
        if (modalPopup.current === e.target) {
            dispatch(changeDetailModal(detailModal))
        }
    }

    return (
        <div className="modal detail_modal flex justify-center items-center absolute left-0 w-full h-screen" style={{ top: scroll }} ref={modalPopup} onClick={closeModal}>
            <div className="detail_container flex gap-5 rounded-lg w-4/5 h-4/5 p-5 bg-zinc-50">
                <div className="content_container flex flex-col justify-between w-1/2">
                    {
                        imgPath != null &&
                        <div className="img_wrap h-full rounded-xl bg-gray-100">
                            <img src="" alt="이미지 경로" />
                        </div>
                    }
                    <div className="text_container h-full rounded-xl bg-gray-100 p-5 text-gray-600">
                        <p className="text">아마 게시글이겠지</p>
                    </div>
                    {/* TODO 데이터 바인딩하기 */}
                    <div className="content_option">
                        <h3 className='hidden'>좋아요, 댓글</h3>
                        <ul className='post_option flex flex-row gap-3 text-xl h-10'>
                            <li className='flex flex-row items-center'>
                                <span className='hidden'>좋아요</span>
                                <i className="fa fa-gratipay mr-1 text-rose-500" aria-hidden="true"></i>
                                <span className='text-sm'>1</span>
                            </li>
                            <li className='flex flex-row items-center'>
                                <span className='hidden'>댓글</span>
                                <i className="fa fa-comment-o mr-1" aria-hidden="true"></i>
                                <span className='text-sm'>20</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="reply_container flex flex-col w-1/2">
                    <div className="h-full overflow-y-scroll">
                        {/* 댓글map 돌린거 조건에 따라 신고하기, 더보기로 변경되야함 */}
                        {/* for문 돌려야함 */}
                        <div className='reply_container relative  px-5 border-solid border-b border-gray-200'>
                            <div className='reply_author'>
                                <Link className='inline-flex gap-5'>
                                    <div className='img_wrap w-24 h-24 p-2 rounded-full overflow-hidden border border-solid border-gray-200'>
                                        <img src={`${process.env.PUBLIC_URL}/img/default_profile.png`} alt='작성자명' />
                                    </div>
                                    <p className='flex flex-col gap-1 text_wrap justify-center'>
                                        <span className="text-lg">사용자명</span>
                                        <span className='flex gap-5 font-bold text-sesac-green'>
                                            <span>캠퍼스명</span>
                                            <span>n일전</span>
                                        </span>
                                    </p>
                                </Link>
                                <p className='reply_content mt-5 text-sm py-5'>댓글내용</p>
                            </div>
                            {/* 조건에 따라 신고하기/삭제하기 */}
                            {
                                !isPostMine ?
                                    <button className='absolute right-5 top-3'>
                                        <span className='hidden'>댓글 삭제하기</span>
                                        <i className="fa fa-trash-o text-gray-300 text-2xl" aria-hidden="true"></i>
                                    </button>
                                    : <button className='absolute right-5 top-3'>
                                        <span className='hidden'>댓글 신고하기</span>
                                        <i className="fa fa-trash-o text-gray-300 text-2xl" aria-hidden="true"></i>
                                    </button>
                            }
                        </div>
                    </div>
                    <div className="reply_input_container">
                        <input className="w-full h-10 rounded-md border border-solid border-black p-3" type="text" placeholder="댓글 달기" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostDetail