import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { changeDetailModal } from "../../store/modalSlice";
import { getCookie } from "../../modules/handle_cookie";
/* component */
import PostDetail from "../common/post/PostDetail";

const ExploreResult = function () {
  const SERVER = process.env.REACT_APP_BACK_BASE_URL;
  let session_key = getCookie('session_key')
  let { tagName } = useParams();

  // 상태
  const [result, setResult] = useState([]);
  const [isPostMine, setIsPostMine] = useState(false);
  const [detailPath, setDetailPath] = useState('');
  let detailModal = useSelector((state) => state.detailModal);

  let dispatch = useDispatch();

  // 검색결과 데이터 바인딩
  useEffect(() => {
    const SERVER_EXPLORE_TAG_RESULT = `${SERVER}/explore/tag/${tagName}/`;
    axios.get(SERVER_EXPLORE_TAG_RESULT)
      .then(
        response => {
          let copy = [...response.data]
          setResult(copy)
        }
      )
      .catch(
        error => {
          console.error(error)
        }
      )
  }, [])

  // 조건들 다 변하고 모달창뜨게
  useEffect(() => {
    if (detailPath.length !== 0) {
      dispatch(changeDetailModal(detailModal))
    }
    return () => {
      setDetailPath('');
    }
  }, [detailPath + isPostMine])

  return (
    <div className="ExploreTagDetail w-4/5 p-10">
      <header>
        <h2 className="hidden">검색내용</h2>
        <div
          className="chat_user_info flex items-center p-1 gap-8">
          <div className="flex justify-center items-center w-24 h-24 rounded-full overflow-hidden border border-gray-300  bg-gray-200 p-1">
            <i className="fa fa-hashtag text-3xl" aria-hidden="true"></i>
          </div>
          <p className="flex flex-col">
            <span className="font-medium text-2xl">#{tagName}</span>
            <span className="text-lg">게시물</span>
            <span className="font-semibold">{result.length}</span>
          </p>
        </div>
      </header>
      <main>
        <h2 className="my-5 font-medium text-sm text-sesac-green">인기 게시물</h2>
        <article>
          <ul className="grid grid-cols-3 gap-1" >
            {
              result.map((element, i) => {
                return (
                  <li className="bg-red-100 h-80" key={i}>
                    <Link
                      className="flex flex-col justify-center items-center w-full h-full"
                      to="#"
                      onClick={async (e) => {
                        e.preventDefault();
                        try {
                          const response = await axios.get(`${SERVER}/post/${element.username}/${element.id}`, {
                            headers: {
                              'Authorization': session_key
                            }
                          })
                          setIsPostMine(response.data.isPostMine)
                          setDetailPath(`${element.username}/${element.id}`)
                        } catch (error) {
                          console.error(error)
                        }
                      }}>
                      <span>{element.content}</span>
                      <span className="font-semibold text-sesac-green">By. {element.username}</span>
                    </Link>
                  </li>
                )
              })
            }
          </ul>
        </article>
      </main>
      {detailModal && <PostDetail isPostMine={isPostMine} detailPath={detailPath} />}
    </div>
  );
};


export default ExploreResult;