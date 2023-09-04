import axios from "axios";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeWirteModal } from "../../../store/modalSlice";

import { getCookie } from "../../../modules/handle_cookie";

import '../../../css/modal.css'

const SERVER = process.env.REACT_APP_BACK_BASE_URL;
let username = getCookie('username')

const WritePost = function () {
  /* variables */
  const SERVER_POST_WRITE = `${SERVER}/post/${username}/`;
  const session_key = getCookie('session_key')

  /* DOM */
  const textLength = useRef();
  const modalPopup = useRef();

  /* states */
  const [content, setContent] = useState([]);
  const [imgPath, setImgPath] = useState(null);
  let writeModal = useSelector((state) => state.wirteModal)

  let dispatch = useDispatch();

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
      dispatch(changeWirteModal(writeModal))
    } catch (error) {
      console.log(error.response.data);
    }
  };

  /* Functions */
  const onFileChange = (event) => setImgPath(event.target.files[0]);

  const limitText = (e) => {
    let text = e.target.value
    textLength.current.innerHTML = text.length;
    if (text.length > 500) {
      text = text.substring(0, 500);
      textLength.current.innerHTML = 500
    }
  }

  const closeModal = (e) => {
    if (modalPopup.current === e.target) {
      dispatch(changeWirteModal(writeModal))
    }
  }

  const closeModalbutton = (e) => {
    dispatch(changeWirteModal(writeModal))
  }

  return (
    <div className="modal post-modal absolute w-full h-full" ref={modalPopup} onClick={closeModal}>
      <form className='w-1/2 h-96 bg-zinc-50 rounded-xl translate-x-1/2 translate-y-1/2' onSubmit={uploadPost}>
        <div className="text_container relative h-3/4 rounded-xl pt-12 px-8 box-border">
          <textarea className="w-full h-full rounded-xl p-7 bg-gray-100 outline-0"
            placeholder="무슨 일이 있었나요?"
            name="content"
            onChange={(e) => setContent(e.target.value.trim())}
            onKeyUp={limitText}
          />
          <div className="modal_footer flex justify-between items-center w-full px-12 absolute left-0 bottom-3">
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
              <span className="current_length" ref={textLength}>0 </span>/
              <span className="max_length"> 500</span>
            </span>
          </div>
        </div>
        <div className="text-end mt-9 mr-8">
          <button className="w-36 h-11 border border-solid rounded-xl bg-sesac-green text-slate-100 text-lg" type="submit">완료</button>
        </div>
      </form>
      <button className="absolute top-4 right-4 text-4xl text-gray-200" type="button" onClick={closeModalbutton}>
        <i className="fa fa-times" aria-hidden="true"></i>
        <span className="hidden">닫기</span>
      </button>
    </div>
  );
};
export default WritePost;
