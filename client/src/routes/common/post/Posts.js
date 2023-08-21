import { useParams } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import { getCookie } from "../../../modules/handle_cookie";

/* global variables */
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
            if (typeof response.data.message === 'undefined' ){
              setPostList(response.data);
            }
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
          (postList.length == undefined | postList.length == 0) ? <p>게시글 없음</p> :
            postList.map((post, i) => (
                <div key = {i} style={{ 'margin' : '0 auto', 'width' : '70%' }}>
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
  const SERVER_POST_POST = `${SERVER}/post/${post.username}/${post.id}/`

  const [postDetailClickStatus, setPostDetailClickStatus] = useState(false)
  const [postUpdateClickStatus, setPostUpdateClickStatus] = useState(false)
  const [isPostMine, setIsPostMine] = useState(false)

  const img_path = `${SERVER}${post.img_path}`;


  /* functions */
  useEffect(() => { 
    /* 더보기 옵션을 위해 내 게시글인지 비교 */
    const getPostDetail = async () => {
          try {
            const response = await axios({
              method: "get",
              url: SERVER_POST_POST,
              headers: { 
                'Authorization': `${session_key}`
              },
            });
            setIsPostMine(response.data.isPostMine);
          } catch (error) {
            console.log(error.response.data);
          }
        }
        getPostDetail();
  }, []);


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
        {/* 더보기 영역 */}
        <div style={{ 'textAlign' : 'right' }}>{
          isPostMine ? <GetMoreBtnForPostWhenPostIsMine setPostDetailClickStatus = {setPostDetailClickStatus} SERVER_POST_POST = {SERVER_POST_POST} post = {post} setPostUpdateClickStatus = {setPostUpdateClickStatus} /> : <GetMoreBtnForPostWhenPostIsNotMine setPostDetailClickStatus = {setPostDetailClickStatus} SERVER_POST_POST = {SERVER_POST_POST} post = {post}  setPostUpdateClickStatus = {setPostUpdateClickStatus}/>
        }</div>
        <hr style={{ 'margin' : '5px' }}/>
        <table style={{ 'width' : '100%', 'margin' : '10px 0' }}>
          <tbody>
            <tr style={{ 'color' : '#187B46','textAlign' : 'left', 'fontWeight' : '800', 'fontSize' : '1.2em' }}>
              <td colSpan={2}>
                {/* 프로필 영역 */}
                <a href={CLIENT_PROFILE_DETAIL}>{ post.username }</a>
              </td>
            </tr>
            <tr>
              {/* border */}
              <td colSpan={2} style={{'marginTop': '10px', 'marginBottom':'50px', 'borderTop': '3px solid #A7A7A7'}}></td>
            </tr>
            <tr>
              {/* img_path */}
              {
                (post.img_path == null) ? null : <td style={{ 'width' : '40%' }}><img src={img_path} alt={`${post.img_path}`} style={{ 'width' : '190px', 'margin' : '0 auto'  }}/></td>
              }
              {/* content */}
              <td style={{ 'width' : '60%' }}>
                <div style={{ 'border' : '3px solid #187B46', 'margin' : '0 15px', 'height' : '190px', 'overflow' : 'scroll'  }}>
                  { post.content  }
                </div>
              </td>
            </tr>
            <tr>
              {/* border */}
              <td colSpan={2} style={{'marginTop': '10px', 'marginBottom':'50px', 'borderTop': '3px solid #A7A7A7'}}></td>
            </tr>
            <tr>
              {/* 좋아요, 댓글 영역 */}
            </tr>
          </tbody>
        </table>    
      </div>
      {/* post detail 영역 */}
      {
        postDetailClickStatus ? <PostDetail post = {post} img_path = {img_path} isPostMine = {isPostMine} CLIENT_PROFILE_DETAIL = {CLIENT_PROFILE_DETAIL} SERVER_PROFILE_DETAIL = {SERVER_PROFILE_DETAIL}/> : null
      }
      {/* post update 영역 */}
      {
        postUpdateClickStatus ? <PostUpdate post = {post} img_path = {img_path} setPostUpdateClickStatus = {setPostUpdateClickStatus} SERVER_POST_POST = {SERVER_POST_POST}  /> : null
      }
    </>
  )
}

const PostDetail = function ({post, img_path, isPostMine, CLIENT_PROFILE_DETAIL, SERVER_PROFILE_DETAIL}) {
  return (
    <div className="PostDetail" style={{ 'margin' : '10px auto', 'width' : '80%', 'border' : '1px solid blue', 'display' : 'flex' }}>
      {/* 1. 게시물 영역 */}
      <div style={{ 'height' : '400px', 'width' : '52%', 'padding' : '5px' }}>
        {/* 2-1. 사진 영역 */}
        {
          (post.img_path == null) ? null : (
          <div style={{ 'height' : '44%', }} >
            <img src={img_path} alt={`${post.img_path}`}  style={{ 'display' : 'block', 'height' : '100%', 'margin' : '5px auto'  }} />
          </div>
        )
        }        
        {/* 1-2. 글 영역 */}
        <div style={{ 'display' : 'block', 'border' : '3px solid #187B46', 'margin' : '5px 15px', 'height' : '44%', 'overflow' : 'scroll'  }}>
          { post.content  }
        </div>
        {/* 1-3. 댓글, 좋아요 영역 */}
        <div style={{ 'display' : 'block', 'height' : '7%', 'border' : '2px solid #187B46', }}>
          
        </div>
      </div>
      {/* 2. 댓글 영역 */}
      <div style={{ 'border' : '1px solid black', 'width' : '48%'  }}>
        {/* 2-1. 남긴 댓글 영역 */}
        <div style={{ 'display' : 'block', 'margin' : '10px 5px', 'height' : '83%', 'border' : '2px solid #187B46',   }}>
        
        </div>    
        {/* 2-2. 댓글 달기 영역 */}
        <div style={{ 'display' : 'block', 'margin' : '10px 5px', 'height' : '8%', 'border' : '2px solid #187B46',    }}>
        
        </div>
      </div>
    </div> 
  );
};

  /* 더보기 버튼 옵션 - 내 것 */
  const GetMoreBtnForPostWhenPostIsMine = function ({setPostDetailClickStatus, setPostUpdateClickStatus, SERVER_POST_POST, post}) {
    return (
      <p>
        <span colSpan={2} onClick={() => {
            setPostDetailClickStatus(true);
          }}>상세보기
        </span>&nbsp;|&nbsp; 
        <span colSpan={2} onClick={() => {
            setPostUpdateClickStatus(true);
          }}>수정하기</span>&nbsp;|&nbsp; 
        <span colSpan={2} onClick={ async (event) => {
            event.preventDefault();
            try {
              const response = await axios({
                method: "delete",
                url: SERVER_POST_POST,
                headers: { 
                  'Authorization': `${session_key}`
                  },
              });
              console.log(response.data);
              window.location.reload()
            } catch (error) {
              console.log(error.response.data);
            };
          }}>삭제하기</span>&nbsp;|&nbsp; 
        <span colSpan={2} onClick={() => {
          setPostDetailClickStatus(false);
        }}>취소하기</span>
      </p>
    )
  };
    /* 더보기 버튼 옵션 - 남의 것 */
  const GetMoreBtnForPostWhenPostIsNotMine = function ({setPostDetailClickStatus, setPostUpdateClickStatus, SERVER_POST_POST, post}) {
    return (
      <p>
        <span colSpan={2} onClick={() => {
            setPostDetailClickStatus(true);
          }}>상세보기
        </span>&nbsp;|&nbsp; 
        <span colSpan={2} onClick={() => {
            // 신고하기 기능 추가할 것
          }}>신고하기</span>&nbsp;|&nbsp;
        <span colSpan={2} onClick={() => {
          setPostDetailClickStatus(false);
        }}>취소하기</span>
      </p>
    )
  }
  const PostUpdate = function ({post, img_path, SERVER_POST_POST, setPostUpdateClickStatus}) {  
    {/* 
        TODO: 프론트 전달 사항
        - back에서 기존 content랑 수정 content랑 내용이 같으면 처리를 안하는 걸로 했음. 
        - front에선 origin_content == update_content가 같으면 수정버튼 비활성화되는 걸로 처리해주세용!!~
    */}

    /* variables */
    const [content, setContent] = useState(post.content);
    
    /* functions */
    const updatePost = async (event) => {
      /* 포스팅 처리 */
      event.preventDefault();
      try {
        const response = await axios({
          method: "put",
          url: SERVER_POST_POST,
          data: {
            'original_content' : post.content,
            'update_content' : content,
          },
          headers: { 
            'Content-Type': "multipart/form-data",
            'Authorization': `${session_key}`
           },
        });
        console.log(response.data);
        window.location.reload();
      } catch (error) {
        console.log(error.response.data);
      }
    };
    return (
        <div className="PostUpdate" style={{ 'margin' : '4px auto', 'width' : '80%', 'border' : '1px solid black' }}>
          <form onSubmit={updatePost}>   
            <table style={{ 'width' : '100%', 'margin' : '10px 0' }}>
              <tbody>
                <tr>
                  {/* img_path */}
                  {
                    (post.img_path == null) ? null : <td style={{ 'width' : '40%' }}><img src={img_path} alt={`${post.img_path}`} style={{ 'width' : '190px', 'margin' : '0 auto'  }}/></td>
                  }
                  {/* content */}
                  <td style={{ 'width' : '60%' }}>
                    <div style={{ 'border' : '3px solid #187B46', 'margin' : '0 15px', 'height' : '190px', 'overflow' : 'scroll'  }}>
                    <textarea
                      style={{'width' : '100%', 'height' : '100%'}}
                      name="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>  
            <br/>
            <input type="submit" value="수정하기"  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" />&nbsp;
            <input type="submit" value="취소하기"  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>{
              setPostUpdateClickStatus(false);
            }}/>
        </form>
      </div>
      );
  }

export default Posts;