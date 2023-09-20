import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { changeWirteModal } from "../../../store/modalSlice";
import { getCookie } from "../../../modules/handle_cookie";

const WritePost = function () {
  let username = getCookie('username');
  let session_key = getCookie('session_key');
  const SERVER = process.env.REACT_APP_BACK_BASE_URL;
  const SERVER_POST_WRITE = `${SERVER}/post/${username}/`;

  // DOM
  const textLength = useRef();
  const modalPopup = useRef();

  // State
  const [scroll, setScroll] = useState();
  const [content, setContent] = useState([]);
  const [imgPath, setImgPath] = useState(null);
  const [tumbnailWrap, setTumbnailWrap] = useState('invisible');
  const [tumbnail, setTumbnail] = useState();
  let writeModal = useSelector((state) => state.wirteModal);

  let dispatch = useDispatch();

  // 게시글 작성
  const uploadPost = async (e) => {
    e.preventDefault();
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
          'Authorization': session_key
        },
      });
    }
    catch (error) {
      console.log(error.response.data);
    }
    finally {
      window.location.reload();
    }
  };

  // 스크롤 위치 추적
  useEffect(() => {
    setScroll(window.scrollY)
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; }
  }, [scroll]);

  // 글자수 제한
  const limitText = (e) => {
    let text = e.target.value
    textLength.current.innerHTML = text.length;
    if (text.length > 500) {
      text = text.substring(0, 500);
      textLength.current.innerHTML = 500
    }
  };

  // 검은배경 클릭시 모달창 닫기
  const closeModal = (e) => {
    if (modalPopup.current === e.target) {
      dispatch(changeWirteModal(writeModal))
    }
  }

  // 이미지 미리보기
  const PreviewTumbnail = (e) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      setTumbnail(e.target.result)
      setTumbnailWrap('')
    }

    reader.readAsDataURL(e.target.files[0]);
  }

  return (
    <div className="modal post_modal flex justify-center items-center absolute w-full h-screen" style={{ top: scroll }} ref={modalPopup} onClick={closeModal}>
      <form className='w-1/2 h-96 bg-zinc-50 rounded-xl' onSubmit={uploadPost}>
        <div className="text_container relative h-3/4 rounded-xl pt-12 px-8 box-border">
          <textarea className="w-full h-full rounded-xl p-7 bg-gray-100 resize-none outline-none"
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
              onChange={(e) => {
                setImgPath(e.target.files[0])
                PreviewTumbnail(e)
              }}
            />
            <span className="text-gray-400">
              <span className="current_length" ref={textLength}>0 </span>/
              <span className="max_length"> 500</span>
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-5 px-8">
          <div className={`tumbnail w-16 h-16 rounded-xl border border-solid border-gray-200 overflow-hidden ${tumbnailWrap}`} >
            <img src={tumbnail} alt="미리보기 이미지" />
          </div>
          <button className="w-36 h-11 border border-solid rounded-xl bg-sesac-green text-slate-100 text-lg" type="submit">완료</button>
        </div>
      </form>
    </div>
  );
};

export default WritePost;
