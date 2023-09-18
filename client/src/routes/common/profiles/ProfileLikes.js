import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getCookie } from "../../../modules/handle_cookie";

let session_key = getCookie('session_key')
const SERVER = process.env.REACT_APP_BACK_BASE_URL

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

export default ProfileLikes