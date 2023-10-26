import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { setDetailPath } from "../../store/postSlice";
import { getCookie } from "../../modules/handleCookie";

const SERVER = process.env.REACT_APP_BACK_BASE_URL

const Notice = function () {
    // cookie
    let username = getCookie('username')

    // 상태
    const [readNotificationDataResult, setReadNotificationDataResult] = useState([]);
    const [notReadNotificationDataResult, setNotReadNotificationDataResult] = useState([]);
    const [recommendDataResult, setRecommendDataResult] = useState([]);
    const [isNotice, setIsNotice] = useState(true);
    let noticeNav = useSelector((state) => state.noticeNav);

    let dispatch = useDispatch();

    useEffect(() => {
        if (isNotice) {
          getNotification();
        } else {
          axios.get(`/post/recommend/`)
            .then(response => {
              let copy = [...response.data];
              setRecommendDataResult(copy);
            })
            .catch(error => console.error(error));
        }
      }, [isNotice]);
      
      let getNotification = () => {
        axios.get(`/user/${username}/notify/`)
          .then(response => {
            let copy = { ...response.data };
            setNotReadNotificationDataResult([...copy.notRead]);
            setReadNotificationDataResult([...copy.read]);
            requestReadNotification();
          })
          .catch(error => console.error(error));
      }
      
      let requestReadNotification = () => {
        axios.put(`/user/${username}/notify/`)
          .then(response => {
            console.log('읽음 처리');
          })
          .catch(error => console.error(error));
      }
      
    return (
        <div className={`w-[350%] h-screen absolute z-20 left-full top-0 border border-gray-300 p-5 rounded-r-2xl bg-white shadow-min-nav ${noticeNav ? 'animate-intro' : 'hidden'}`}>
            <h2 className="text-2xl my-5">알림</h2>
            <div className="flex justify-evenly border-b border-black p-2 text-xl">
                <button className={`${isNotice ? "text-black" : "text-gray-300"}`} onClick={(e) => {
                    setIsNotice(!isNotice);
                }}>알림</button>
                <button className={`${isNotice ? "text-gray-300" : "text-black"}`} onClick={(e) => {
                    setIsNotice(!isNotice);
                }}>추천게시물</button>
            </div>
            <div className="h-4/5 mt-6 px-1 overflow-scroll-auto">
                {isNotice ? (
                    <div className="p-2">
                        <ul>
                            {
                                (notReadNotificationDataResult && readNotificationDataResult) ? (
                                    (notReadNotificationDataResult.length === 0 && readNotificationDataResult.length === 0) ? (
                                        <div className="mb-12">
                                            <div className="text-center text-gray-500">도착한 알림이 없어요.</div>
                                        </div>
                                    ) : null
                                ) : null
                            }

                            {
                                notReadNotificationDataResult && notReadNotificationDataResult.length !== 0 ? (
                                    <div className="mb-12">
                                        <div className="flex items-center w-full pb-1 mb-2">
                                            <div className="w-[7%] h-0.5 border-b-2 border-gray-300">　</div>
                                            <div className="w-fit mx-2 text-sm text-gray-500">읽지 않은 알림</div>
                                            <div className="w-[56%] h-0.5 border-b-2 border-gray-300">　</div>
                                        </div>
                                        {notReadNotificationDataResult.map((element, i) => (
                                            <Notification element={element} key={i} />
                                        ))}
                                    </div>
                                ) : null
                            }
                            {
                                readNotificationDataResult && readNotificationDataResult.length !== 0 ? (
                                    <div>
                                        <div className="flex items-center w-full pb-1 mb-2">
                                            <div className="w-[7%] h-0.5 border-b-2 border-gray-300">　</div>
                                            <div className="w-fit mx-2 text-sm text-gray-500">읽은 알림</div>
                                            <div className="w-[66%] h-0.5 border-b-2 border-gray-300">　</div>
                                        </div>
                                        {readNotificationDataResult.map((element, i) => (
                                            <Notification element={element} key={i} />
                                        ))}
                                    </div>
                                ) : null
                            }
                        </ul>
                    </div>
                ) : (
                    <ul>
                        {
                            recommendDataResult && recommendDataResult.length === 0 ? (
                                <div className="mb-12">
                                    <div className="text-center text-gray-500">아직 추천 게시물이 없어요.</div>
                                </div>
                            ) : (recommendDataResult.map((element, i) => (
                                <li className="mb-3" key={i}>
                                    <Link to={`/post/${element.uuid}`} className="flex items-center gap-4" onClick={(e) => {
                                        dispatch(setDetailPath(`${element.username}/${element.id}`));
                                    }}>
                                        <span className="flex justify-center w-1/6 text-5xl text-gray-500">{i + 1}</span>
                                        <article className="text-sm">
                                            <p>
                                                <span className="text-lg mr-1">{element.name}</span>
                                                <span className="text-sm text-sesac-green">{element.campus_name} 캠퍼스</span>
                                            </p>
                                            <p>{element.content && element.content.length > 10 ? `${element.content.slice(0, 10)} ...` : element.content}</p>
                                            <p className="text-red-300">
                                                <i className="fa fa-heart" aria-hidden="true"></i> 좋아요 {element.like}개
                                            </p>
                                        </article>
                                    </Link>
                                </li>
                            )))}
                    </ul>
                )}
            </div>
        </div>
    );

}
function Notification({ element, i }) {
    let dispatch = useDispatch();
    return (
        <li className="mb-3 flex items-center justify-center" key={i}>
            <Link to={element.uri} className="flex items-center gap-3" onClick={() => {
                if (!(element.type == 'follow')) {
                    dispatch(setDetailPath(`${element.targeted_user_username}/${element.post_id}`));
                }
            }}>
                {element.type.split('_')[0] == 'report' ? (
                    <Report notification={element} />
                ) : (
                    <>
                        <div className="img_wrap w-1/5 h-1/5 rounded-full border border-gray-200 overflow-hidden p-1.5">
                            <img src={SERVER + element.profile_img_path} alt={element.targeting_user_name} />
                        </div>
                        <div className="sender_info">
                            <p>
                                <span className="text-xs text-gray-500">
                                    {element.occur_date}
                                    {element.occur_date != undefined ? (!(element.occur_date.includes("년")) ? " 전" : "") : ""}
                                </span>
                            </p>
                            <div className="chat_info flex gap-2">
                                <p className="text-[0.85rem] text-gray-500">
                                    <span className="text-black font-b">{`${element.targeting_user_name}`}</span>님이 회원님
                                    <NotifycationContent type={element.type} />
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </Link>
        </li>
    )
}
function Report({ notification }) {
    let getKoCategory = (category) => {
        switch (category.split('_')[1]) {
            case 'reply':
                return '댓글';
            case 'post':
                return '게시물';
        }
    }
    
    return (
        <>
            <div className="w-1/5 h-1/5 flex justify-center items-center rounded-full border border-gray-200 overflow-hidden p-1.5">
                <i class="fa fa-ban text-rose-600 text-4xl font-extrabold" aria-hidden="true"></i>
            </div>
            <div className="sender_info">
                <p>
                    <span className="text-xs text-gray-500">
                        {notification.occur_date}
                        {
                            notification.occur_date != undefined ?
                                (!(notification.occur_date.includes("년")) ? " 전" : "") : ""
                        }
                    </span>
                </p>
                <div className="chat_info flex gap-2">
                    <p className="text-[0.85rem] text-gray-500">
                        회원님 {`${getKoCategory(notification.type)}`}이 <span className="text-red-600">신고</span> 처리되어 삭제됐습니다.
                    </p>
                </div>
            </div>
        </>
    )
}

function NotifycationContent({ type }) {
    switch (type) {
        case 'reply':
            return (
                <> 게시물에 <span className="text-green-600">댓글</span>을 남겼습니다.</>
            )
        case 'like':
            return (
                <> 게시물에 <span className="text-red-600">좋아요</span>를 눌렀습니다.</>
            )
        case 'follow':
            return (
                <>을 <span className="text-blue-600">팔로우</span>하기 시작했습니다.</>
            )
    }
}

export default Notice;