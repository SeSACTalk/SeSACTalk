import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query'

import { getCookie } from '../../../modules/handle_cookie';
import Navbar from './Navbar';

const Main = function () {
    // states
    const [managerProfileList, setManagerProfileList] = useState([]);
    const [postList, setPostList] = useState([]);

    // cookie
    let username = getCookie('username')
    let session_key = getCookie('session_key')

    const SERVER = process.env.REACT_APP_BACK_BASE_URL
    const SERVER_POST_POSTS = `${SERVER}/post/${username}/`;

    const { isLoading, error, data } = useQuery('Post', () => {
        axios.get(`${SERVER}/post/${username}`, {
            headers: {
                'Authorization': session_key
            }
        })
            .then(
                response => {
                    if (typeof response.data.message === 'undefined') {
                        setPostList(response.data);
                    }
                }
            )
            .catch(
                error => console.error(error)
            )
    })

    useEffect(() => {
        axios.get(SERVER)
            .then(
                response => {
                    let copy = [...response.data]
                    setManagerProfileList(copy)
                    console.log(managerProfileList)
                }
            )
            .catch(
                error => console.error(error)
            )
    }, []);

    return (
        <div className='main_container flex'>
            <Navbar></Navbar>
            <div className='main_content_container w-4/5 px-10'>
                <h2 className='hidden'>관리자 프로필</h2>
                <ul className='staff_profile px-2 py-5 flex gap-5 border-solid border-b border-gray-300 '>
                    {
                        managerProfileList.map((element, i) => {
                            return (
                                <li className='w-30' key={i}>
                                    <div className='img_wrap p-2 border-4 border-double rounded-full border-gray-200'>
                                        <img src={SERVER + element.profile_img_path} alt={element.campus} />
                                    </div>
                                    <p className='mt-1 text-xs text-center'>{element.campus} 캠퍼스</p>
                                </li>
                            )
                        })
                    }
                </ul>
                <section className='post mt-8 mx-24 '>
                    <h2 className='hidden'>게시글</h2>
                    {/* for 문 */}
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
                    </article>
                </section>
            </div>
        </div >
    );
};

export default Main;