import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import UserDetail from "./UserDeatil";

const UserList = function () {
    // 상태들
    const [scroll, setScroll] = useState();
    const [users, setUsers] = useState([]); // 사용자 리스트
    const [campuses, setCampuses] = useState([]); // 캠퍼스필터
    const [userId, setUserId] = useState();
    const [username, setUsername] = useState(''); // 사용자명
    const [campusName, setCampusName] = useState(''); // 캠퍼스명
    const [date, setDate] = useState(''); // 날짜기반
    const [detail, setDetail] = useState(false);

    useEffect(() => {
        axios.get(`/admin/user/?username=${username}&campus=${campusName}&date=${date}`)
            .then(
                response => {
                    // 사용자 리스트 복사
                    let list_copy = [...response.data.list]
                    setUsers(list_copy)

                    // 캠퍼스 리스트 복사
                    let campus_copy = [...response.data.campus]
                    setCampuses(campus_copy)
                }
            )
            .catch(
                error => {
                    console.error(error)
                }
            )
    }, [username + campusName + date])

    useEffect(() => {
        setScroll(window.scrollY)
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; }
    }, [scroll])

    return (
        <div className="user_container w-4/5 p-10">
            <div className="flex justify-between p-3">
                <div className="flex gap-3">
                    <select
                        className="border border-black h-6"
                        defaultValue=''
                        onChange={(e) => { setCampusName(e.target.value) }}>
                        <option value=''>캠퍼스 카테고리</option>
                        {
                            campuses.map((element, i) => {
                                return (
                                    <option key={i} value={element.name}>{element.name}</option>
                                )
                            })
                        }
                    </select>
                    <label className="hidden" htmlFor="latest">날짜선택</label>
                    <input id="date"
                        className="border border-black h-6"
                        type="date" onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                    <input className="border border-black px-2" type="text"
                        placeholder="사용자명을 검색해보세요."
                        onChange={(e) => {
                            setUsername(e.target.value)
                        }} />
                </div>
            </div>
            <table className="w-full mt-5 text-sm text-center text-gray-500">
                <thead>
                    <tr className="border-b">
                        <th scope="col" className="px-6 py-3">이름</th>
                        <th scope="col" className="px-6 py-3">이메일</th>
                        <th scope="col" className="px-6 py-3">캠퍼스</th>
                        <th scope="col" className="px-6 py-3">과정명</th>
                        <th scope="col" className="px-6 py-3">가입일</th>
                        <th scope="col" className="px-6 py-3">활성화 여부</th>
                        <th scope="col" className="px-6 py-3">관리자 여부</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((element, i) => {
                            return (
                                <tr className="border-b cursor-pointer" key={i}
                                    onClick={() => {
                                        setUserId(element.id)
                                        setDetail(!detail)
                                    }}>
                                    <td className="px-6 py-4">{element.name}</td>
                                    <td className="px-6 py-4">{element.email}</td>
                                    {
                                        element.second_course ?
                                            <td className="px-6 py-4">{element.second_course.campus.name}</td> :
                                            <td className="px-6 py-4">{element.first_course.campus.name}</td>
                                    }

                                    <td className="px-6 py-4">{element.first_course.name}</td>
                                    <td className="px-6 py-4">{element.signup_date}</td>
                                    <td className="px-6 py-4">{String(element.is_active)}</td>
                                    <td className="px-6 py-4">{String(element.is_staff)}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            {/* modal */}
            {detail && <UserDetail userId={userId} detail={detail} setDetail={setDetail} scroll={scroll} />}
        </div>
    )
}

export default UserList;