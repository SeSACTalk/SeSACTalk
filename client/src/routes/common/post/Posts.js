import { useParams } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import { getCookie } from "../../../modules/handle_cookie";

const SERVER = process.env.REACT_APP_BACK_BASE_URL;
const session_key = getCookie('session_key')

const Posts = function () {
  /* variables */
  let { username } = useParams();
  const SERVER_POST_POSTS = `${SERVER}/post/${username}/`;

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
  /* variables */
  const CLIENT_PROFILE_DETAIL = `/profile/${post.username}/`;
  const SERVER_PROFILE_DETAIL = `${SERVER}/profile/${post.username}`;

  const [postClickStatus, setPostClickStatus] = useState(false)
  const [postDetailOptionText, setPostDetailOptionText] = useState('글 상세 보기')

  const img_path = `${SERVER}${post.img_path}`;

  {/* TODO: profile객체를 가져와 profile img_path로 프로필 사진 가져오기 */}
  /*
    <properties>
    id
    content
    date
    img_path
    user
    tag_set
    report_status
    uuid,
    username
  */
  return (
    <>
      <div className="Post" style={{ 'margin' : '4px auto', 'width' : '80%', 'border' : '1px solid black' }}>
          <table style={{ 'width' : '100%', 'margin' : '10px 0' }}>
            <tbody>
              <tr style={{ 'color' : '#187B46','textAlign' : 'left', 'fontWeight' : '800', 'fontSize' : '1.2em' }}>
                <td colSpan={2}>
                  {/* 프로필 영역 */}
                  <a href={CLIENT_PROFILE_DETAIL}>{ post.username }</a>
                </td>
              </tr>
              <tr style={{ 'color' : 'blue','textAlign' : 'right', }}>
                {/* 글 상세 보기 영역 */}
                <td colSpan={2} onClick={() => {
                    setPostClickStatus(!postClickStatus);
                    postClickStatus ? setPostDetailOptionText('글 상세 보기') : setPostDetailOptionText('글 상세 보기 닫기')
                  }}>{postDetailOptionText}
                </td>
              </tr>
              <tr>
                {/* border */}
                <td colSpan={2} style={{'margin-top': '10px', 'margin-bottom':'50px', 'border-top': '3px solid #A7A7A7'}}></td>
              </tr>
              <tr>
                {/* img_path */}
                <td style={{ 'width' : '40%' }}>
                  <img src={img_path} alt={`${post.img_path}`} style={{ 'width' : '190px', 'margin' : '0 auto'  }}/>
                </td>
                {/* content */}
                <td style={{ 'width' : '60%' }}>
                  <div style={{ 'border' : '3px solid #187B46', 'margin' : '0 15px', 'height' : '190px', 'overflow' : 'scroll'  }}>
                    { post.content  }
                  </div>
                </td>
              </tr>
              <tr>
                {/* border */}
                <td colSpan={2} style={{'margin-top': '10px', 'margin-bottom':'50px', 'border-top': '3px solid #A7A7A7'}}></td>
              </tr>
              <tr>
                {/* 좋아요, 댓글 영역 */}
              </tr>
            </tbody>
          </table>    
      </div>
      {/* post detail 영역 */}
      {
        postClickStatus ? <PostDetail post = {post} img_path = {img_path} CLIENT_PROFILE_DETAIL = {CLIENT_PROFILE_DETAIL} SERVER_PROFILE_DETAIL = {SERVER_PROFILE_DETAIL}/> : null
      }
    </>
  )
}

const PostDetail = function ({post, img_path, CLIENT_PROFILE_DETAIL, SERVER_PROFILE_DETAIL}) {
  /* variables */
  const SERVER_POST_POST = `${SERVER}/post/${post.uuid}/`;

  /* functions */
  useEffect(() => { /* 포스트 디테일 바운딩 시 가져오기 */
    const getPostDetail = async () => {
          try {
            const response = await axios({
              method: "get",
              url: SERVER_POST_POST,
              headers: { 
                'Authorization': `${session_key}` 
              },
            });
            console.log(response.data)
          } catch (error) {
            console.log(error.response.data);
          }
        }
    getPostDetail();
  }, []);

  return (
    <div className="PostDetail" style={{ 'margin' : '4px auto', 'width' : '80%', 'border' : '1px solid blue' }}>
      {/* 1. 더보기 영역 */}
      <div style={{ 'textAlign' : 'right' }}>더보기</div>
      <hr style={{ 'margin' : '5px' }}/>
      <div style={{ 'display' : 'flex'}}>
        {/* 2. 게시물 영역 */}
        <div style={{ 'height' : '400px', 'width' : '52%', 'padding' : '5px' }}>
          {/* 2-1. 사진 영역 */}
          <div style={{ 'height' : '44%', }} >
            <img src={img_path} alt={`${post.img_path}`}  style={{ 'display' : 'block', 'height' : '100%', 'margin' : '5px auto'  }} />
          </div>
          {/* 2-2. 글 영역 */}
          <div style={{ 'display' : 'block', 'border' : '3px solid #187B46', 'margin' : '5px 15px', 'height' : '44%', 'overflow' : 'scroll'  }}>
            { post.content  }
          </div>
          {/* 2-3. 댓글, 좋아요 영역 */}
          <div style={{ 'display' : 'block', 'height' : '7%', 'border' : '2px solid #187B46', }}>
            
          </div>
        </div>
        {/* 3. 댓글 영역 */}
        <div style={{ 'border' : '1px solid black', 'width' : '48%'  }}>
          {/* 3-1. 남긴 댓글 영역 */}
          <div style={{ 'display' : 'block', 'margin' : '10px 5px', 'height' : '83%', 'border' : '2px solid #187B46',   }}>
          
          </div>    
          {/* 3. 댓글 달기 영역 */}
          <div style={{ 'display' : 'block', 'margin' : '10px 5px', 'height' : '8%', 'border' : '2px solid #187B46',    }}>
          
          </div>
        </div>
      </div>
    </div> 
  );
};

export default Posts;