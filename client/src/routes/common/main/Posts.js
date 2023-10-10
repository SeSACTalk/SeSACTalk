import axios from "axios";
import React, { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getCookie } from "../../../modules/handle_cookie";
import { setDetailPath } from "../../../store/postSlice";
import { changeOptionModal } from "../../../store/modalSlice";

/* components */
import StaffProfile from "../../general/StaffProfile";
import PostOption from "../post/PostOption";
import ReportPost from "../post/ReportPost";
import PostEdit from "../post/PostEdit";

// cookie
let username = getCookie('username')
let session_key = getCookie('session_key')

const SERVER = process.env.REACT_APP_BACK_BASE_URL

const Posts = function () {
  // states
  const [postList, setPostList] = useState([]);
  const [postInfo, setPostInfo] = useState({});
  const [isPostMine, setIsPostMine] = useState(false);

  let optionModal = useSelector((state) => state.optionModal);
  let reportModal = useSelector((state) => state.reportModal);
  let postEditModal = useSelector((state) => state.postEditModal);

  let dispatch = useDispatch();

  // post 실시간으로 받아오기
  let post = useQuery(['post'], () => {
    return axios.get(`/post/${username}`)
      .then(
        response => {
          return response.data
        }
      )
      .catch(
        error => console.error(error)
      )
  })

  // console.log(post.data)
  // console.log(post.isLoading)
  // console.log(post.error)

  useEffect(() => {
    if (post.data && typeof post.data.message == 'undefined') {
      setPostList(post.data);
    }
  }, [post.data])

  return (
    <div className='main_content_container w-4/5 px-10'>
      <StaffProfile />
      <section className='post mt-8 mx-24 '>
        <h2 className='hidden'>게시글</h2>
        {
          postList.length === 0
            ? <p className="text-center">SeSACTalk과 함께하게 되어 반가워요! 다양한 사람들과 팔로우를 맺고 새로운 글을 작성해보세요!</p>
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
                        <span className='text-sm'>{element.like_set.length}</span>
                      </li>
                      <li className='flex items-center'>
                        <span className='hidden'>댓글</span>
                        <i className="fa fa-comment-o mr-1" aria-hidden="true"></i>
                        <span className='text-sm'>{element.reply_set.length}</span>
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
                      let copy = {...element};
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
        {reportModal && <ReportPost isPostMine={isPostMine} postInfo={postInfo} />}
        {postEditModal && <PostEdit />}
      </section>
    </div >
  )
}

export default Posts