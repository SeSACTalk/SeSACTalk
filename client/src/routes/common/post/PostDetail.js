import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { changeReportModal } from "../../../store/modalSlice"
import ReportContent from "../post/ReportContent";

const PostDetail = function () {
    let navigate = useNavigate();
    let dispatch = useDispatch();

    /* Server */
    const SERVER = process.env.REACT_APP_BACK_BASE_URL;

    /* States */
    const [scroll, setScroll] = useState();
    const [post, setPost] = useState([]);
    const [replys, setReplys] = useState([]);
    const [replyUploadStauts, setReplyUploadStauts] = useState(false);
    const [likeStatus, setLikeStatus] = useState();
    const [likeCount, setLikeCount] = useState();
    const [replyInfo, setReplyInfo] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [postId, setPostId] = useState(0);
    let detailPath = useSelector((state) => state.detailPath);
    let reportModal = useSelector((state) => state.reportModal);

    /* Refs */
    const modalPopup = useRef();

    useEffect(() => {
        setScroll(window.scrollY)
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; }
    }, [scroll])

    useEffect(() => {
        axios.get(`/post/${detailPath}?request_post`).then((response) => {
            // set post
            let copy = { ...response.data.post };
            setPost(copy);

            // set like
            setLikeStatus(response.data.post.like_status);
            setLikeCount(response.data.post.like_set);
        }).catch((error) => {
            console.error(error)
        })

        setPostId(detailPath.split('/')[1])
        getReplys(detailPath.split('/')[1]);
    }, [detailPath])

    // 댓글 업로드 후 다시 불러오기
    useEffect(() => {
        getReplys(postId);
        setReplyContent('');
    }, [replyUploadStauts, postId])

    /**
     * 모달창 닫기
     * @param {Event} e 
     */
    const closeModal = (e) => {
        if (modalPopup.current === e.target) {
            navigate(-1)
        }
    }

    /**
     * 댓글 요청
     * @param {String} postId 
     */
    let getReplys = (postId) => {
        axios.get(`/reply/${postId}/`).then((response) => {
            let copy = [...response.data]
            setReplys(copy)
        }).catch((error) => {
            console.error(error)
        })
    }

    /**
     * 댓글 작성
     * @param {Event} e 
     * @param {String} replyContent 
     */
    let uploadReply = (e, replyContent) => {
        e.preventDefault();
        axios.post(`/reply/${postId}/`, {
            'content': replyContent.trim()
        }).then((response) => {
            setReplyUploadStauts(!replyUploadStauts);
        }).catch((error) => {
            console.error(error)
        })
    }

    /**
     * 댓글 삭제
     * @param {String} e 
     * @param {String} replyId 
     */
    let deleteReply = (e, replyId) => {
        e.preventDefault();
        axios.delete(`/reply/${postId}/${replyId}/`).then((response) => {
            setReplyUploadStauts(!replyUploadStauts);
            console.log(response.data)
        }).catch((error) => {
            console.error(error)
        })
    }

    /**
     * 좋아요 요청
     * @param {Event} e 
     * @param {String} postId 
     */
    let likePost = (e, postId) => {
        e.preventDefault();
        axios.post(`/post/${postId}/like/`).then((response) => {
            setLikeCount(prevLikeCount => prevLikeCount + 1);
            setLikeStatus(prevLikeStatus => !prevLikeStatus);
        }).catch((error) => {
            console.error(error)
        })
    }

    /**
     * 좋아요 삭제
     * @param {Event} e 
     * @param {String} postId 
     */
    let unlikePost = (e, postId) => {
        e.preventDefault();
        axios.delete(`/post/${postId}/like/`).then((response) => {
            setLikeCount(prevLikeCount => prevLikeCount - 1);
            setLikeStatus(prevLikeStatus => !prevLikeStatus);
        }).catch((error) => {
            console.error(error)
        })
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
                </div>
                <div className="reply_container flex flex-col justify-between w-1/2 h-full mt-1">
                    {/* 게시물 주인 & 댓글 영역 */}
                    <div className="flex flex-col h-[90%]">
                        {/* 게시물 주인 */}
                        <div className='post_author h-[15%] flex justify-between items-end w-full reply_author pb-2 px-5 border-solid border-b border-gray-200'>
                            <div className='flex gap-5'>
                                <div className='img_wrap w-14 h-14 p-2 rounded-full overflow-hidden border border-solid border-gray-200'>
                                    <Link to={`/profile/${post.username}`}>
                                        <img src={`${post.is_staff ? (process.env.PUBLIC_URL + "/img/logo.png") : (SERVER + post.profile_img_path)}`} alt={post.username} />
                                    </Link>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className={`text-base font-semibold ${post.is_staff ? "text-sesac-green" : null}`}>{post.is_staff ? post.campusname + " 캠퍼스" : post.name}</span>
                                    <p className='flex gap-2 text_wrap justify-between items-center'>
                                        {
                                            post.is_staff ? (null
                                            ) :
                                                <span className='flex text-sm font-semibold gap-3 text-sesac-green'>{post.campusname} 캠퍼스</span>}
                                        <span className="text-slate-400 text-xs font-medium">{post.date}
                                            {
                                                post.date !== undefined ?
                                                    !(post.date.includes("년")) ? " 전" : "" : ""
                                            }</span>
                                    </p>
                                </div>
                            </div>
                            <div className="post_option">
                                <h3 className='hidden'>좋아요, 댓글</h3>
                                <ul className='post_option flex flex-row justify-end gap-4 text-xl h-10'>
                                    <li className='flex flex-row items-center'>
                                        <span className='hidden'>좋아요</span>
                                        <i
                                            className={`fa fa-heart${likeStatus ? '' : '-o'} mr-[0.3rem] text-rose-500 cursor-pointer`}
                                            aria-hidden="true"
                                            onClick={(e) => {
                                                likeStatus ? unlikePost(e, post.id) : likePost(e, post.id);
                                            }}
                                        ></i>
                                        <span className='text-sm'>{
                                            likeCount
                                        }</span>
                                    </li>
                                    <li className='flex flex-row items-center'>
                                        <span className='hidden'>댓글</span>
                                        <i className="fa fa-comment-o mr-1" aria-hidden="true"></i>
                                        <span className='text-sm'>{
                                            replys !== undefined ? replys.length : 0
                                        }</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="overflow-y-auto py-3 px-2 h-[77%] mt-2">
                            {/* 댓글 */}
                            <div className='reply_container flex flex-col gap-2'>
                                {
                                    replys.map((element, i) => (
                                        <div key={i} className=" bg-[#e9f3d8] py-3 rounded-lg relative">
                                            <div className='reply_author px-3 '>
                                                <div className='flex gap-4'>
                                                    <div className='img_wrap w-9 h-9 p-1 rounded-full overflow-hidden border-[1.5px] border-solid border-white'>
                                                        <Link to={`/profile/${element.reply.username}`}>
                                                            <img src={`${element.reply.is_staff ? (process.env.PUBLIC_URL + "/img/logo.png") : (SERVER + element.reply.img_path)}`} alt={element.username} />
                                                        </Link>
                                                    </div>
                                                    <div className="flex flex-col justify-center">
                                                        <p className='flex gap-3 items-center'>
                                                            <span className="text-xs">{element.reply.is_staff ? element.reply.campusname + " 캠퍼스" : element.reply.name}</span>
                                                            <span className="text-slate-400 text-[0.6rem] font-light">
                                                                {element.reply.date}
                                                                {
                                                                    element.reply.date !== undefined ?
                                                                        !(element.reply.date.includes("년")) ? " 전" : "" : ""
                                                                }
                                                            </span>
                                                        </p>
                                                        <p className='reply_content font-semibold text-sm'>{element.reply.content}</p>
                                                    </div>
                                                </div>
                                                {/* 댓글 작성자 조건에 따라 신고하기/삭제하기 */}
                                                {
                                                    element.isReplyMine ?
                                                        <div className='absolute right-3 top-2 text-xs text-gray-600'>
                                                            <span className='hidden'>댓글 삭제</span>
                                                            <button
                                                                onClick={(e) => {
                                                                    deleteReply(e, element.reply.id)
                                                                }}>삭제하기</button>
                                                        </div>
                                                        : <div className='absolute right-3 top-2 text-xs text-gray-600'>
                                                            <span className='hidden'>댓글 신고</span>
                                                            <button
                                                                onClick={() => {
                                                                    let copy = { ...element.reply }
                                                                    setReplyInfo(copy)
                                                                    dispatch(changeReportModal(reportModal))
                                                                }
                                                                }
                                                            >신고하기</button>
                                                        </div>
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        {reportModal && <ReportContent contentType={'reply'} contentInfo={replyInfo} />}
                    </div>
                    {/* 댓글 input 영역 */}
                    <div className="reply_input_container h-[10%]">
                        <input
                            className="w-full h-10 rounded-md border border-solid border-black p-3"
                            type="text"
                            value={replyContent}
                            placeholder="댓글 달기"
                            onChange={(e) => setReplyContent(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    uploadReply(e, replyContent);
                                }
                            }
                            }
                        />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default PostDetail