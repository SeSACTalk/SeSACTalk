import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { changePostEditModal } from "../../../store/modalSlice";


const PostEdit = function () {
    let dispatch = useDispatch()

    /* Server */
    const SERVER = process.env.REACT_APP_BACK_BASE_URL;

    /* States */
    const [scroll, setScroll] = useState();
    const [post, setPost] = useState([]);
    const [content, setContent] = useState('');
    let postEditModal = useSelector((state) => state.postEditModal);
    let detailPath = useSelector((state) => state.detailPath);

    /* Refs */
    const modalPopup = useRef()

    useEffect(() => {
        setScroll(window.scrollY)
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; }
    }, [scroll])

    useEffect(() => {
        axios.get(`/post/${detailPath}?request_post`).then((response) => {
            let copy = [{ ...response.data.post }]
            setPost(copy)
            setContent(response.data.post.content)
        }).catch((error) => {
            console.error(error)
        })
    }, [detailPath])

    // 검은배경 클릭시 모달창 닫기
    const closeModal = (e) => {
        if (modalPopup.current === e.target) {
            dispatch(changePostEditModal(postEditModal))
        }
    }

    // 게시글 수정
    const updatePost = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/post/${detailPath}/`, {
                'content': content,
            });
            console.log(response.status)
        }
        catch (error) {
            console.log(error);
        }
        finally {
            window.location.reload();
        }
    };

    return (
        <div className="modal detail_modal flex justify-center items-center absolute left-0 w-full h-screen" style={{ top: scroll }} ref={modalPopup} onClick={closeModal}>
            <div className="detail_container flex gap-5 rounded-lg w-1/3 h-1/2 p-5 bg-zinc-50">
                {/* 게시글 내용 */}
                {
                    post.map((element, i) => {
                        return (
                            <form className="content_container flex flex-col justify-between gap-2 w-full" onSubmit={updatePost} key={i}>
                                {
                                    element.img_path != null &&
                                    <div className="flex items-center w-full h-full overflow-hidden">
                                        <div className="w-1/2 p-2 rounded-xl bg-gray-100">
                                            <img src={SERVER + element.img_path} alt="이미지 미리보기" />
                                        </div>
                                        <div className="w-1/2 flex justify-center">
                                            <p className="text-red-400">이미지는 수정할 수 없습니다</p>
                                        </div>
                                    </div>
                                }
                                <textarea className="text_container h-full rounded-xl bg-gray-100 p-5 text-gray-600 resize-none outline-none" defaultValue={element.content} onChange={(e) => {
                                    setContent(e.target.value)
                                }} />
                                <div className="flex justify-end gap-2">
                                    <button className="px-4 py-2 rounded-3xl bg-sesac-green text-white" type="button" onClick={() => {
                                        dispatch(changePostEditModal(postEditModal))
                                    }}>취소하기</button>
                                    <button className="px-4 py-2 rounded-3xl bg-sesac-green text-white" type="submit">수정하기</button>
                                </div>
                            </form>
                        )
                    })
                }
            </div>
        </div >
    )
}

export default PostEdit