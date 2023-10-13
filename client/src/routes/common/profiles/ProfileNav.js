import axios from "axios";
import React, { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getCookie } from "../../../modules/handle_cookie";
import { setDetailPath } from "../../../store/postSlice";
import { changeOptionModal } from "../../../store/modalSlice";

/* components */
import PostOption from "../post/PostOption";
import PostEdit from "../post/PostEdit";

// cookie
let session_key = getCookie('session_key')

const SERVER = process.env.REACT_APP_BACK_BASE_URL

function ProfilePosts({ user_id }) {
  // states
  const [postList, setPostList] = useState([]);
  const [postInfo, setPostInfo] = useState({});
  const [isPostMine, setIsPostMine] = useState(false);

  let optionModal = useSelector((state) => state.optionModal);
  let postEditModal = useSelector((state) => state.postEditModal);

  let dispatch = useDispatch();

  // post 실시간으로 받아오기
  let post = useQuery(['post'], () => {
    return axios.get(`/profile/${user_id}/post/`)
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
    }
  }, [post.data])


  return (
    <div className='main_content_container w-[90%]'>
      <section className='profile_post mt-8 mx-24 '>
        <h2 className='hidden'>게시글</h2>
        {
          postList.length === 0
            ? <p className="text-center">아직 등록된 게시물이 없어요!</p>
            : postList.map((element, i) => {
              return (
                <article className='relative post_container p-5 h-96 border-solid border-b border-gray-200' key={i}>
                  <div className='post_author'>
                    <Link className='inline-flex gap-5' to={`/profile/${element.username}`}>
                      <div className='img_wrap w-24 h-24 p-2 rounded-full overflow-hidden border border-solid border-gray-200'>
                        <img src={`${SERVER}/media/profile/default_profile.png`} alt={element.username} />
                      </div>
                      <p className='flex flex-col gap-1 text_wrap justify-center'>
                        <span className='text-base'>{element.name}</span>
                        <span className='text-sm text-sesac-green'>{element.campusname} 캠퍼스</span>
                      </p>
                    </Link>
                  </div>
                  <div className="post_content_wrap h-1/2">
                    <p className='post_content mt-5 text-sm'>{element.content}</p>
                  </div>
                  {/* TODO 데이터 바인딩 + 해시태그 클릭시 검색결과창 이동 */}
                  <div className="post_footer flex justify-between items-center">
                    <h3 className="hidden">해시태그</h3>
                    {
                      element.hash_tag_name.length !== 0 ?
                        (element.hash_tag_name.map((element, i) => {
                          return (
                            <ul className="flex gap-3" key={i}>
                              <li className="px-2 py-1 rounded-xl bg-sesac-green text-white">
                                #{element}
                              </li>
                            </ul>
                          )
                        }))
                        :
                        <div className="invisible">
                        </div>
                    }

                    <h3 className='hidden'>좋아요, 댓글</h3>
                    <ul className='post_option flex justify-end gap-3 h-12 text-xl'>
                      <li className='flex items-center'>
                        <span className='hidden'>좋아요</span>
                        <i className="fa fa-gratipay mr-1 text-rose-500" aria-hidden="true"></i>
                        <span className='text-sm'>{
                          element.like_set
                        }</span>
                      </li>
                      <li className='flex items-center'>
                        <span className='hidden'>댓글</span>
                        <i className="fa fa-comment-o mr-1" aria-hidden="true"></i>
                        <span className='text-sm'>{
                          element.reply_set
                        }</span>
                      </li>
                    </ul>
                  </div>
                  <button className='absolute right-5 top-8' onClick={
                    async () => {
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
                      // 상세경로 저장
                      dispatch(setDetailPath(`${element.username}/${element.id}`))
                      // 게시글 세부정보 저장
                      let copy = { ...element };
                      setPostInfo(copy)
                      // 옵션 모달 띄우기
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
        {optionModal && <PostOption isPostMine={isPostMine} postInfo={postInfo} />}
        {postEditModal && <PostEdit />}
      </section>
    </div >
  )
}

function ProfileLikes({ user_id }) {
  const [likeList, setLikeList] = useState([]);
  const SERVER_PROFILE_LIKES = `${SERVER}/profile/${user_id}/like/`;

  useEffect(() => {
    axios.get(SERVER_PROFILE_LIKES, {
      headers: {
        'Authorization': session_key
      }
    })
      .then(
        response => {
          if (response.data && typeof response.data.message == 'undefined') {
            setLikeList(response.data)
          }
          console.log(response.data)
        }
      )
      .catch(
        error => console.error(error)
      )
  }, []);


  return (
    <div className='main_content_container'>
      <section className='like mt-8 mx-24 '>
        <h2 className='hidden'>프로필 좋아요</h2>
        {
          likeList.length === 0
            ? <p className="text-center">이웃 새싹에게 좋아요한 게시물이 없어요!</p>
            : likeList.map((element, i) => {
              return (
                <div className={`like_container flex gap-6 items-center p-5 h-24 ${i == 1 ? 'border-solid border-b border-gray-200' : ''}`} key={i}>
                  <Link to={`/profile/${element.post_user_username}`}>
                    <div className='img_wrap w-16 h-16 p-2 rounded-full overflow-hidden border border-solid border-gray-200'>
                      <img src={SERVER + element.post_user_profile_img_path} alt={element.post_user_username} />
                    </div>
                  </Link>
                  <div className="flex flex-col align-middle gap-1">
                    <div className='post_owner_info'>
                      <p className='flex items-center gap-3 text_wrap justify-center text-zinc-500'>
                        <div>
                          <i className="fa fa-gratipay text-rose-500" aria-hidden="true"></i>
                        </div>
                        <div className='text-base'><span className="text-sesac-green 800 font-semibold">{element.post_user_name}</span><span>님의 게시물</span></div>
                        <div className="text-xs">{element.format_date}</div>
                      </p>
                    </div>
                    <article className="like_content">
                      <Link>
                        <p className='flex flex-col gap-1 text_wrap justify-center'>
                          <span className='text-lg'>{
                            element.post_content.length > 20 ? element.post_content.substring(0, 20) + '...' : element.post_content
                          }</span>
                        </p>
                      </Link>
                    </article>
                  </div>
                </div>
              )
            })
        }
      </section>
    </div>
  )
}

function ProfileReplys({ user_id }) {
  const [replyList, setReplyList] = useState([]);
  const SERVER_PROFILE_REPLYS = `${SERVER}/profile/${user_id}/reply/`;

  useEffect(() => {
    axios.get(SERVER_PROFILE_REPLYS, {
      headers: {
        'Authorization': session_key
      }
    })
      .then(
        response => {
          if (response.data && typeof response.data.message == 'undefined') {
            setReplyList(response.data)
          }
          console.log(response.data)
        }
      )
      .catch(
        error => console.error(error)
      )
  }, []);


  return (
    <div className='main_content_container'>
      <section className='reply mt-8 mx-24 '>
        <h2 className='hidden'>프로필 댓글</h2>
        {
          replyList.length === 0
            ? <p className="text-center">이웃 새싹에게 단 댓글이 없어요!</p>
            : replyList.map((element, i) => {
              return (
                <div className={`reply_container flex gap-6 items-center p-5 h-24 ${i == 1 ? 'border-solid border-b border-gray-200' : ''}`} key={i}>
                  <Link to={`/profile/${element.post_user_username}`}>
                    <div className='img_wrap w-16 h-16 p-2 rounded-full overflow-hidden border border-solid border-gray-200'>
                      <img src={SERVER + element.post_user_profile_img_path} alt={element.post_user_username} />
                    </div>
                  </Link>
                  <div className="flex flex-col align-middle gap-1">
                    <div className='post_owner_info'>
                      <p className='flex items-center gap-3 text_wrap justify-center text-zinc-500'>
                        <div>
                          <i class="fa fa-reply" aria-hidden="true"></i>
                        </div>
                        <div className='text-base'><span className="text-sesac-green 800 font-semibold">{element.post_user_name}</span><span>님의 게시물</span></div>
                        <div className="text-xs">{element.format_date}</div>
                      </p>
                    </div>
                    <article className="reply_content">
                      <Link>
                        <p className='flex flex-col gap-1 text_wrap justify-center'>
                          <span className='text-lg'>{
                            element.content.length > 20 ? element.content.substring(0, 20) + '...' : element.content
                          }</span>
                        </p>
                      </Link>
                    </article>
                  </div>
                </div>
              )
            })
        }
      </section>
    </div>
  )
}

export { ProfilePosts, ProfileLikes, ProfileReplys }