import React, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, Link } from 'react-router-dom';

const UserList = function () {
    // 상태들
    const [users, setUsers] = useState([]); // 사용자 리스트
    const [campuses, setCampuses] = useState([]); // 캠퍼스필터
    const [username, setUsername] = useState(''); // 사용자명
    const [campusName, setCampusName] = useState('');
    const [date, setDate] = useState('');

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

    return (
        <div className="user_container w-4/5 p-10">
            <div className="flex gap-5">
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
            <table className="w-full text-sm text-left text-gray-500">
                <thead>
                    <tr>
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
                                <tr className="bg-white border-b " key={i}>
                                    <td className="px-6 py-4">
                                        <Link to={`${element.id}`}>{element.name}</Link>
                                    </td>
                                    <td className="px-6 py-4">{element.email}</td>
                                    <td className="px-6 py-4">{element.first_course.campus.name}</td>
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
        </div >
    )
}

export default UserList;