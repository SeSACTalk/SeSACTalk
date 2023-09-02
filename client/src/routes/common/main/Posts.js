import axios from "axios";
import React, { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query'

import { getCookie } from "../../../modules/handle_cookie";
import StaffProfile from "./StaffProfile";

const Posts = function () {
  // states
  const [postList, setPostList] = useState([]);

  // cookie
  let username = getCookie('username')
  let session_key = getCookie('session_key')

  const SERVER = process.env.REACT_APP_BACK_BASE_URL
  const SERVER_POST_POSTS = `${SERVER}/post/${username}/`;

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

  // console.log(post.data)
  // console.log(post.isLoading)
  // console.log(post.error)

  if (post.data) {
    if (typeof post.data.message === 'undefined') {
      setPostList(post.data);
    }
  }

  return (
    <div className='main_content_container w-4/5 px-10'>
      <StaffProfile />
      <section className='post mt-8 mx-24 '>
        <h2 className='hidden'>게시글</h2>
        {
          postList.length === 0
            ? <p className="text-center">SeSACTalk에 가입하신 것을 환영해요! 다양한 사람들과 팔로우를 맺고 새로운 글을 작성해보세요!</p>
            : postList.map((element, i) => { // TODO for문에 데이터 바인딩 해야함
              <article className='relative post_container p-5 h-96 border-solid border-b border-gray-200'>
                <div className='post_author flex gap-5 '>
                  <div className='img_wrap w-24 h-24 p-2 rounded-full overflow-hidden border border-solid border-gray-200'>
                    <img src={`${process.env.PUBLIC_URL}/img/default_profile.png`} alt='작성자명' />
                  </div>
                  <p className='flex flex-col gap-1 text_wrap justify-center'>
                    <span className='text-base'>작성자</span>
                    <span className='text-sm'>캠퍼스명</span>
                  </p>
                </div>
                <p className='post_content mt-5 text-sm'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                <h3 className='hidden'>좋아요, 댓글</h3>
                <ul className='absolute right-5 bottom-8 post_option flex flex-row justify-end gap-3 text-xl'>
                  <li className='flex flex-row items-center'>
                    <span className='hidden'>좋아요</span>
                    <i class="fa fa-gratipay mr-1 text-rose-500" aria-hidden="true"></i>
                    <span className='text-sm'>1</span>
                  </li>
                  <li className='flex flex-row items-center'>
                    <span className='hidden'>댓글</span>
                    <i class="fa fa-comment-o mr-1" aria-hidden="true"></i>
                    <span className='text-sm'>20</span>
                  </li>
                </ul>
                <button className='absolute right-5 top-8'>
                  <span className='hidden'>게시글 세부설정</span>
                  <i className="fa fa-ellipsis-h text-gray-300" aria-hidden="true"></i>
                </button>
              </article>
            })
        }
      </section>
    </div>
  )
}

export default Posts