import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const SERVER = process.env.REACT_APP_BACK_BASE_URL;

const PostDetail = function () {
    // DOM
    const modalPopup = useRef();

    // State
    const [scroll, setScroll] = useState();
    const [post, setPost] = useState([]);
    const [isPostMine, setIsPostMine] = useState(true);
    let detailPath = useSelector((state) => state.detailPath);

    let navigate = useNavigate();

    // 스크롤 위치 추적
    useEffect(() => {
        setScroll(window.scrollY)
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; }
    }, [scroll])

    // 게시글 불러오기
    useEffect(() => {
        axios.get(`/post/${detailPath}?request_post`).then((response) => {
            let copy = { ...response.data.post }
            setPost(copy)
            setIsPostMine(response.data.isPostMine)
        }).catch((error) => {
            console.error(error)
        })
    }, [])

    // 검은배경 클릭시 모달창 닫기
    const closeModal = (e) => {
        if (modalPopup.current === e.target) {
            navigate(-1)
        }
    }

    return (
        <div className="modal detail_modal flex justify-center items-center absolute left-0 z-30 w-full h-screen" style={{ top: scroll }} ref={modalPopup} onClick={closeModal}>
            <div className="detail_container flex gap-5 rounded-lg w-4/5 h-4/5 p-5 bg-zinc-50">
                {/* 게시글 내용 */}
                <div className="content_container flex flex-col justify-between gap-2 w-1/2">
                    <div className="flex flex-col gap-2 h-full">
                        {
                            post.img_path != null ?
                                <>
                                    <div className="img_wrap flex justify-center h-1/2 rounded-xl bg-gray-100 overflow-hidden">
                                        <img className="w-auto" src={SERVER + post.img_path} alt="첨부 이미지" />
                                    </div>
                                    <div className="text_container h-1/2 rounded-xl bg-gray-100 p-5 text-gray-600">
                                        <p className="text">{post.content}</p>
                                    </div>
                                </>
                                :
                                <div className="text_container h-full rounded-xl bg-gray-100 p-5 text-gray-600">
                                    <p className="text">{post.content}</p>
                                </div>
                        }
                    </div>
                    {/* TODO 데이터 바인딩하기 */}
                    <div className="content_option mr-1">
                        <h3 className='hidden'>좋아요, 댓글</h3>
                        <ul className='post_option flex flex-row justify-end gap-3 text-xl h-10'>
                            <li className='flex flex-row items-center'>
                                <span className='hidden'>좋아요</span>
                                <i className="fa fa-gratipay mr-1 text-rose-500" aria-hidden="true"></i>
                                <span className='text-sm'>{post.like_set == undefined ? 0 : post.like_set.length}</span>
                            </li>
                            <li className='flex flex-row items-center'>
                                <span className='hidden'>댓글</span>
                                <i className="fa fa-comment-o mr-1" aria-hidden="true"></i>
                                <span className='text-sm'>{post.reply_set == undefined ? 0 : post.reply_set.length}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* 여기까지가 */}
                <div className="reply_container flex flex-col justify-between w-1/2 h-full ">
                    {/* 게시물 주인 & 댓글 영역 */}
                    <div className="flex flex-col">
                        {/* 게시물 주인 */}
                        <div className='post_author flex justify-between items-end w-full reply_author pb-2 px-5 border-solid border-b border-gray-200'>
                            <div className='flex gap-5'>
                                <div className='img_wrap w-14 h-14 p-2 rounded-full overflow-hidden border border-solid border-gray-200'>
                                    <Link to={`/profile/${post.username}`}>
                                        <img src={`${process.env.PUBLIC_URL}/img/default_profile.png`} alt='작성자명' />
                                    </Link>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-base font-semibold">{post.name}</span>
                                    <p className='flex gap-2 text_wrap justify-between items-center'>
                                        <span className='flex text-sm font-semibold gap-3 text-sesac-green'>{post.campusname} 캠퍼스</span>
                                        <span className="text-slate-400 text-xs font-medium">n일전 게시물</span>
                                    </p>
                                </div>
                            </div>
                            <div className="post_option">
                                <h3 className='hidden'>좋아요, 댓글</h3>
                                <ul className='post_option flex flex-row justify-end gap-3 text-xl h-10'>
                                    <li className='flex flex-row items-center'>
                                        <span className='hidden'>좋아요</span>
                                        <i className="fa fa-gratipay mr-1 text-rose-500" aria-hidden="true"></i>
                                        <span className='text-sm'>{post.like_set.length}</span>
                                    </li>
                                    <li className='flex flex-row items-center'>
                                        <span className='hidden'>댓글</span>
                                        <i className="fa fa-comment-o mr-1" aria-hidden="true"></i>
                                        <span className='text-sm'>{post.reply_set.length}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="overflow-y-clip hover:overflow-y-scroll py-3 px-2 h-72">
                            {/* 댓글 */}
                            <div className='reply_container flex flex-col gap-2'>
                                {/* start for statement */}
                                <div className=" bg-[#e9f3d8] py-3 rounded-lg relative">
                                    <div className='reply_author px-3 '>
                                        <div className='flex gap-4'>
                                            <div className='img_wrap w-9 h-9 p-1 rounded-full overflow-hidden border-[1.5px] border-solid border-white'>
                                                <Link to={`/profile/${post.username}`}>
                                                    <img src={`${process.env.PUBLIC_URL}/img/default_profile.png`} alt='작성자명' />
                                                </Link>
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <p className='flex gap-2 text_wrap justify-between items-center'>
                                                    <span className="text-xs">{post.name}</span>
                                                    <span className="text-slate-400 text-[0.6rem] font-light">n일전</span>
                                                </p>
                                                <p className='reply_content font-semibold text-sm'>댓글내용</p>
                                            </div>
                                        </div>
                                        {/* 댓글 작성자 조건에 따라 신고하기/삭제하기 */}
                                        {
                                            isPostMine ?
                                                <button className='absolute right-3 top-2 text-xs text-gray-600'>
                                                    <span className='hidden'>댓글 세부설정</span>
                                                    <span>삭제하기</span> | <span>수정하기</span>
                                                </button>
                                                : <button className='absolute right-3 top-2'>
                                                    <span className='hidden'>댓글 신고</span>
                                                    <span>신고하기</span>
                                                </button>
                                        }
                                    </div>
                                </div>
                                {/* end for statement */}
                            </div>
                        </div>
                    </div>
                    {/* 댓글 input 영역 */}
                    <div className="reply_input_container">
                        <input className="w-full h-10 rounded-md border border-solid border-black p-3" type="text" placeholder="댓글 달기" />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default PostDetail