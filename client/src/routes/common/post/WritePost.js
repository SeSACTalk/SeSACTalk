import { useParams } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getCookie } from "../../../modules/handle_cookie";

const SERVER = process.env.REACT_APP_BACK_BASE_URL;

const WritePost = function () {
  /* variables */
  let navigate = useNavigate()
  let { username } = useParams();
  const SERVER_POST_POSTS = `${SERVER}/post/${username}/write/`;
  const session_key = getCookie('session_key')

  const [content, setContent] = useState([]);
  const [imgPath, setImgPath] = useState(null);

  const uploadPost = async (event) => {
    /* 포스팅 처리 */
    event.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    formData.append("img_path", imgPath);
    try {
      const response = await axios({
        method: "post",
        url: SERVER_POST_POSTS,
        data: formData,
        headers: { 
          'Content-Type': "multipart/form-data",
          'Authorization': `${session_key}`
         },
      });
      console.log(response.data);
      navigate(`/post/${username}`)
    } catch (error) {
      console.log(error.response.data);
    }
  };
  // FileList에서 index 0번 즉 File객체 상태변수에 저장
  const onFileChange = (event) => setImgPath(event.target.files[0]); 

  return (
    <div className="WritePost" style={{'width' : '50%', 'margin' : '20px auto'}}>
      <form onSubmit={uploadPost}>
        <table>
          <tbody>
            <tr>
              {/* 글 내용 : 500자 이내 */}
              <td colSpan={2}>
                <textarea
                  style={{'width' : '100%', 'margin' : '50px auto'}}
                  placeholder="500자 이내 입력"
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
              </td>
            </tr>
            <tr>
              <td>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(event) => onFileChange(event)}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="글쓰기"  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" />
      </form>
    </div>
  );
};
export default WritePost;
