import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";



const ExploreResult = function () {
  const SERVER = process.env.REACT_APP_BACK_BASE_URL;
  let { tagName } = useParams();

  // 상태
  const [result, setResult] = useState([]);

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

  return (
    <div className="ExploreTagDetail w-4/5 p-10">
      <header>
        <h2 className="hidden">검색내용</h2>
        <div
          className="chat_user_info flex items-center h-20 p-1 gap-5">
          <div className="flex justify-center items-center w-16 h-16 rounded-full overflow-hidden border border-gray-300  bg-gray-200 p-1">
            <i className="fa fa-hashtag text-xl" aria-hidden="true"></i>
          </div>
          <p className="flex flex-col">
            <span>{tagName}</span>
            <span className="flex items-end gap-3 text-sm">
              <span className="font-semibold text-sesac-green">
                게시물
              </span>
            </span>
          </p>
        </div>
      </header>
      <main>
        <h2>인기 게시글</h2>
        <article>
          {
            result.map((element, i) => {
              console.log(element)
              return (
                <ul key={i}>
                  <li>element</li>
                </ul>
              )
            })
          }
        </article>
      </main>
    </div>
  );
};


export default ExploreResult;