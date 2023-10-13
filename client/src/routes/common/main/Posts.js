import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from '@tanstack/react-query'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getCookie } from "../../../modules/handle_cookie";
import { setDetailPath } from "../../../store/postSlice";
import { changeOptionModal } from "../../../store/modalSlice";

import { useObserver } from "../../../modules/useObserver";

/* components */
import StaffProfile from "../../general/StaffProfile";
import PostOption from "../post/PostOption";
import ReportContent from "../post/ReportContent";
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

  // DOM
  const bottom = useRef(null);

  let dispatch = useDispatch();
  const navigate = useNavigate()

  const fetchPost = ({ pageParam = 1 }) => {
    return axios.get(`/post/${username}?page=${pageParam}`)
      .then(
        response => {
          return response
        }
      )
      .catch(
        error => console.error(error)
      )
  }

  const {
    data, // api 함수 호출 결과 response, page, pageparams
    error,
    fetchNextPage, // 다음 페이지를 불러오는 함수
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['post'],
    queryFn: fetchPost,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.data.page !== pages[0].totalPage ? lastPage.data.page + 1 : 1
    },
  })

  const onIntersect = ([entry]) => {
    entry.isIntersecting && fetchNextPage();
  }

  useObserver({
    target: bottom,
    onIntersect,
  });

  return (
    <div className='main_content_container w-4/5 px-10'>
      <StaffProfile />
      <section className='post mt-8 mx-24 '>
        <h2 className='hidden'>게시글</h2>
        {status == 'loading' &&
          <>
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw text-9xl text-sesac-sub"></i>
            <span className="sr-only">Loading...</span>
          </>}
        {
          status == 'success' && data &&
          data.pages.map((group, i) => {
            if (group && group.data.result) {
              return group.data.result.map((element) => {
                return (
                  <article className='relative post_container p-5 h-96 border-solid border-b border-gray-200' key={element.id}>
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
                      <UserFeedback postId={element.id} postUuid = {element.uuid} username = {element.username} replySet={element.reply_set} likeStatus={element.like_status} likeCount={element.like_set} />
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
          })
        }
        <div className="h-[1rem]" ref={bottom}></div>
        {/* Modals */}
        {optionModal && <PostOption isPostMine={isPostMine} postInfo={postInfo} />}
        {reportModal && <ReportContent contentType={'post'} contentInfo={postInfo} />}
        {postEditModal && <PostEdit />}
      </section>
    </div >
  )
}

function UserFeedback({ postId, postUuid, username, replySet, likeStatus, likeCount }) {
  const [likestatus, setLikestatus] = useState(likeStatus);
  const [likecount, setLikecount] = useState(likeCount);
  let emptyHeart = '-o'
  let dispatch = useDispatch();

  // 게시글 불러오기
  useEffect(() => {
    setLikestatus(likeStatus);
    setLikecount(likeCount);
  }, [])

  // 좋아요 추가
  let likePost = (e) => {
    e.preventDefault();
    axios.post(`/post/${postId}/like/`).then((response) => {
      setLikecount(prevLikecount => prevLikecount + 1);
      setLikestatus(prevLikestatus => !prevLikestatus);
    }).catch((error) => {
      console.error(error)
    })
  }

  // 좋아요 삭제
  let unlikePost = (e) => {
    e.preventDefault();
    axios.delete(`/post/${postId}/like/`).then((response) => {
      setLikestatus(prevLikecount => prevLikecount - 1);
      setLikestatus(prevLikestatus => !prevLikestatus);
    }).catch((error) => {
      console.error(error)
    })
  }
  return (
    <>
      <h3 className='hidden'>좋아요, 댓글</h3>
      <ul className='post_option flex flex-row justify-end gap-4 text-xl h-10'>
        <li className='flex flex-row items-center'>
          <span className='hidden'>좋아요</span>
          <i
            className={`fa fa-heart${likestatus ? '' : emptyHeart} mr-[0.3rem] text-rose-500 cursor-pointer`}
            aria-hidden="true"
            onClick={(e) => {
              likestatus ? unlikePost(e) : likePost(e);
            }}
          ></i>
          <span className='text-sm'>{
            likecount
          }</span>
        </li>
        <li className='flex flex-row items-center'>
          <Link to={`/post/${postUuid}`} onClick={() => {
            // 상세경로 저장
            dispatch(setDetailPath(`${username}/${postId}`))
          }}>
          <span className='hidden'>댓글</span>
          <i className="fa fa-comment-o mr-1" aria-hidden="true"></i>
          <span className='text-sm'>{
            replySet
          }</span>
          </Link>
        </li>
      </ul>
    </>
  )
}
export default Posts