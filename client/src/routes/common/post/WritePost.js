import { useParams } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getCookie } from "../../../modules/handle_cookie";

import '../../../css/modal.css'

const SERVER = process.env.REACT_APP_BACK_BASE_URL;

const WritePost = function () {
  /* variables */
  let navigate = useNavigate()
  let { username } = useParams();
  const SERVER_POST_WRITE = `${SERVER}/post/${username}/`;
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
        url: SERVER_POST_WRITE,
        data: formData,
        headers: {
          'Content-Type': "multipart/form-data",
          'Authorization': `${session_key}`
        },
      });
      navigate(`/post/${username}`)
    } catch (error) {
      console.log(error.response.data);
    }
  };

  // Functions
  // FileList에서 index 0번 즉 File객체 상태변수에 저장
  const onFileChange = (event) => setImgPath(event.target.files[0]);
  const limitText = (e) => {
    let text = e.target.value
    document.querySelector('.current_length').innerHTML = text.length;
    console.log(document.querySelector('.current_length'))
    if (text.length > 500) {
      text = text.substring(0, 500);
      document.querySelector('current_length').innerHTML = 500
    }
  }

  return (
    <div className="modal post-modal absolute w-full h-full flex justify-center items-center">
      <form className='w-1/2 h-2/3 bg-zinc-50 rounded-xl' onSubmit={uploadPost}>
        {/* 글 내용 : 500자 이내 */}
        <div className="text_container relative h-2/3 rounded-xl pt-12 px-8 box-border">
          <textarea className="w-full h-full rounded-xl p-7 bg-gray-100 outline-0"
            placeholder="무슨 일이 있었나요?"
            name="content"
            onChange={(e) => setContent(e.target.value.trim())}
            onkeyup={limitText}
          />
          <div className="flex justify-between w-full px-12 absolute left-0 bottom-3">
            <label htmlFor="upload_img">
              <span className="hidden">업로드</span>
              <i className="fa fa-camera text-3xl text-gray-400 cursor-pointer" aria-hidden="true"></i>
            </label>
            <input
              id="upload_img"
              className="hidden"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(event) => onFileChange(event)}
            />
            <span className="text-gray-400">
              <span className="current_length">0 </span>/
              <span className="max_length"> 500</span>
            </span>
          </div>
        </div>
        <button className="bg-red-100" type="submit">글쓰기</button>
      </form>
    </div>
  );
};
export default WritePost;
