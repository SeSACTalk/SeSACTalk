import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const ExploreResult = function () {
  const SERVER = process.env.REACT_APP_BACK_BASE_URL;
  let { tagName } = useParams();

  // 상태
  const [result, setResult] = useState([]);

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

  /**
   * 랜덤 이미지 주소 출력 함수
   * @param {number} min - 최솟값
   * @param {number} max - 최댓값
   * @returns {string} - 이미지 경로
   */
  const rand = (min, max) => {
    const random_number = Math.floor(Math.random() * (max - min)) + min;
    const random_img = `${process.env.PUBLIC_URL}/img/thumbnails/000${random_number}.png`
    return random_img
  }

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
                  <li className="relative border border-black h-80 bg-no-repeat bg-right-bottom bg-green-50 before:block before:w-full before:h-full before:bg-white before:opacity-30" style={{ backgroundImage: `url(${rand(1, 7)})` }} key={i}>
                    <Link
                      to={`/post/${element.uuid}`}
                      className="absolute top-0 left-0 flex flex-col justify-center items-center w-full h-full">
                      <span className="font-semibold text-xl">{element.content}</span>
                      <span className="font-semibold text-sesac-green">By. {element.username}</span>
                    </Link>
                  </li>
                )
              })
            }
          </ul>
        </article>
      </main>
    </div>
  );
};


export default ExploreResult;