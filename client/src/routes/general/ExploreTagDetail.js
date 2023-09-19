import { useParams } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";

import {Post} from '../common/post/Posts';
 
/* global variables */
const SERVER = process.env.REACT_APP_BACK_BASE_URL;

const ExploreTagDetail = function () {
  /* variables */
  let { h_name } = useParams();
  const SERVER_EXPLORE_TAG_DETAIL = `${SERVER}/explore/tags/${h_name}/`;

  const [postList, setPostList] = useState([]);  
  const thereIsPost = (postList.length == undefined | postList.length == 0)

  /* functions */
  useEffect(() => { /* 포스트 목록 바운딩 시 가져오기 */
    const getPosts = async () => {
          try {
            const response = await axios({
              method: "get",
              url: SERVER_EXPLORE_TAG_DETAIL,
            });
            setPostList(response.data)
          } catch (error) {
            console.log(error.response.data);
          }
        }
    getPosts();
  }, []);

  return (
    <div className="ExploreTagDetail">
      <hr style={{'margin' : '10px'}}/>
      {
          thereIsPost ? null :
            <>
            <div style={{'display' : 'block','margin' : '30px auto',}}>
                <span style={{'display' : 'block','margin' : '0 auto 10px', 'fontSize' : '2em', 'fontWeight' : 800}}>
                    #{postList[0].hashtag_name}
                </span>
                <span style={{'display' : 'block', 'color' : 'green', 'fontSize' : '1.2em', 'fontWeight' : 700}}>
                    {postList.length}개 게시물
                </span>
            </div>
            <hr style={{'margin' : '10px'}}/>
            </>
        }
      <div className="post_content" style={{'margin' : '20px 0'}}>
        {
          thereIsPost ? <p>게시글 없음</p> :
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


export default ExploreTagDetail;