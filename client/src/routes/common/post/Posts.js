import { useParams } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

const SERVER = process.env.REACT_APP_BACK_BASE_URL;

const Posts = function () {
  /* variables */
  let { username } = useParams();
  const SERVER_POST_POSTS = `${SERVER}/post/${username}/`;

  const [postList, setPostList] = useState([]);

  /* functions */
  /* useEffect(() => { 포스트 목록 바운딩 시 가져오기
    axios.get(SERVER_POST_POSTS)
        .then(response => {
            setPostList(response.data.campus);
        })
        .catch(error => {
            console.error(error);
        });
    }, []); */

  return (
    <div className="Posts">
      <Link to={`/post/${username}/write`} style={{'backgroundColor' : 'blueviolet', 'color' : 'white', 'borderRadius' : '10px'}}>글쓰기</Link>
      <hr style={{'margin' : '10px'}}/>
      <div className="post_content" style={{'margin' : '20px 0', 'width' : '70%'}}>
        post내용
      </div>
      <hr style={{'margin' : '10px'}}/>
    </div>
  );
};
export default Posts;