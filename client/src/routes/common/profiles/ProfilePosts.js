import axios from "axios";
import React, { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getCookie } from "../../../modules/handle_cookie";
import { changeOptionModal } from "../../../store/modalSlice";
/* components */
import StaffProfile from "../../general/StaffProfile";
import PostOption from "../post/PostOption";
import ReportPost from "../post/ReportPost";
import PostDetail from "../post/PostDetail";


// cookie
let username = getCookie('username')
let session_key = getCookie('session_key')

const SERVER = process.env.REACT_APP_BACK_BASE_URL

function ProfilePosts({user_id}){ // states
    const [postList, setPostList] = useState([]);
    const [detailPath, setDetailPath] = useState('')
    const [postId, setPostId] = useState('')
    const [isPostMine, setIsPostMine] = useState(false)

    let optionModal = useSelector((state) => state.optionModal)
    let reportModal = useSelector((state) => state.reportModal)
    let detailModal = useSelector((state) => state.detailModal)
    let dispatch = useDispatch();
  
    const SERVER_POST_POSTS = `${SERVER}/profile/${user_id}/post/`;
  
    // post 실시간으로 받아오기
    let post = useQuery(['post'], () => {
      return axios.get(SERVER_POST_POSTS, {
        headers: {
          'Authorization': session_key
        }
      })
        .then(
          response => {
            return response.data
          }
        )
        .catch(
          error => console.error(error)
        )
    })
    
    useEffect(() => {
      if (post.data && typeof post.data.message == 'undefined') {
        setPostList(post.data);
        console.log(post.data)
      }
    }, [post.data])
  
  
    return (
      <div className='main_content_container'>
        <section className='post mt-8 mx-24 '>
          <h2 className='hidden'>게시글</h2>
          {
            postList.length === 0
              ? <p className="text-center">SeSACTalk과 함께하게 되어 반가워요! 다양한 사람들과 팔로우를 맺고 새로운 글을 작성해보세요!</p>
              : postList.map((element, i) => {
                return (
                  <article className='relative post_container p-5 h-96 border-solid border-b border-gray-200' key={i}>
                    <div className='post_author'>
                      <Link className='inline-flex gap-5' to={`profile/${element.username}`}>
                        <div className='img_wrap w-24 h-24 p-2 rounded-full overflow-hidden border border-solid border-gray-200'>
                          <img src={`${SERVER}/media/profile/default_profile.png`} alt={element.username} />
                        </div>
                        <p className='flex flex-col gap-1 text_wrap justify-center'>
                          <span className='text-base'>{element.username}</span>
                          <span className='text-sm'>캠퍼스명</span>
                        </p>
                      </Link>
                    </div>
                    <p className='post_content mt-5 text-sm'>{element.content}</p>
                    {/* TODO 데이터 바인딩해야함 */}
                    <h3 className='hidden'>좋아요, 댓글</h3>
                    <ul className='absolute right-5 bottom-8 post_option flex flex-row justify-end gap-3 text-xl'>
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
                    <button className='absolute right-5 top-8' onClick={async () => {
                      try {
                        const response = await axios.get(`${SERVER}/post/${element.username}/${element.id}`, {
                          headers: {
                            'Authorization': session_key
                          }
                        })
                        setIsPostMine(response.data.isPostMine)
                      } catch (error) {
                        console.error(error)
                      }
                      setDetailPath(`${element.username}/${element.id}`)
                      setPostId(element.id)
                      dispatch(changeOptionModal(optionModal))
                    }}>
                      <span className='hidden'>게시글 세부설정</span>
                      <i className="fa fa-ellipsis-h text-gray-300 text-2xl" aria-hidden="true"></i>
                    </button>
                  </article>
                )
              })
          }
          {/* Modals */}
          {optionModal && <PostOption detailPath={detailPath} isPostMine={isPostMine} />}
          {reportModal && <ReportPost postId={postId} />}
          {detailModal && <PostDetail detailPath={detailPath} isPostMine={isPostMine} />}
        </section>
      </div>
    )
}

export default ProfilePosts