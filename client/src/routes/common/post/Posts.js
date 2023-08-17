import { useParams } from 'react-router-dom'
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import checkAuthMiddleware from '../../../middleware/checkAuth'
import { getCookie } from '../../../modules/handle_cookie';

const SERVER = process.env.REACT_APP_BACK_BASE_URL

const Posts = function () {
    {/* variables */ }
    let {username} = useParams();
    const SERVER_POST_POSTS = SERVER + `/post/${username}/`
    console.log(username)
    {/* form variables */ }
    return(
        <div>
        게시물 전체 보기
        </div>
    )
}
export default Posts;