import { useParams } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import { getCookie } from "../../../modules/handle_cookie";

const SERVER = process.env.REACT_APP_BACK_BASE_URL;

const Posts = function () {
  /* variables */
  let { username } = useParams();
  const SERVER_POST_POSTS = `${SERVER}/post/${username}/`;
  const session_key = getCookie('session_key')

  const [postList, setPostList] = useState([]);

  /* functions */
  useEffect(() => { /* 포스트 목록 바운딩 시 가져오기 */
    const getPosts = async () => {
          try {
            const response = await axios({
              method: "get",
              url: SERVER_POST_POSTS,
              headers: { 
                'Authorization': `${session_key}`
              },
            });
            console.log(response.data)
            setPostList(response.data);
          } catch (error) {
            console.log(error.response.data);
          }
        }
    getPosts();
  }, []);

  return (
    <div className="Posts">
      <Link to={`/post/${username}/write`} style={{'backgroundColor' : 'blueviolet', 'color' : 'white', 'borderRadius' : '10px'}}>글쓰기</Link>
      <hr style={{'margin' : '10px'}}/>
      <div className="post_content" style={{'margin' : '20px 0'}}>
        {
          postList.map((post, i) => (
              <div style={{ 'margin' : '0 auto', 'width' : '70%' }}>
                <Post post = {post}/>
                {
                  ( postList.length == (i+1) ) ? null : <hr/>
                }
              </div>
            )
          )
        }
      </div>
      <hr style={{'margin' : '10px'}}/>
    </div>
  );
};

const Post =  function ({ post }) {
  {/* TODO: user객체를 가져와, profile만들기 */}
  /*
    <properties>
    id
    content
    date
    img_path
    user
    tag_set
    report_status
    uuid
  */
  return (
    <div style={{ 'margin' : '4px auto', 'width' : '70%', 'border' : '1px solid black' }}>
      {/* date */}
      <p style={{ 'color' : 'red' }}>
        { post.date }
      </p>
      <div>
        <table style={{ 'width' : '100%', 'margin' : '10px 0' }}>
          <tbody>
            <tr>
              {/* img_path */}
              <td style={{ 'width' : '40%' }}>
                <img src={`${SERVER}${post.img_path}`} alt={`${post.img_path}`} style={{ 'width' : '190px', 'height' : '190px', 'margin' : '0 auto'  }}></img>
              </td>
              {/* content */}
              <td style={{ 'width' : '60%' }}>
                <div style={{ 'border' : '3px solid #187B46', 'margin' : '0 15px'  }}>
                  { post.content  }
                </div>
              </td>
            </tr>
          </tbody>
        </table>    
      </div>
    </div>
  )
}
export default Posts;