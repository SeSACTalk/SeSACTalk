import React, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, Link } from 'react-router-dom';

const UserList = function () {
    const [users, setUsers] = useState([]) // 사용자
    const [campuses, setCampuses] = useState([]) // 캠퍼스별

    useEffect(() => {
        axios.get(`/admin/user/?username=&campus=&date=`)
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
    }, [])

    return (
        <div className="user_container w-4/5 p-10">
            <div>
                <h4>날짜순 정렬</h4>
                <ul>
                    <li>
                        <label htmlFor='latest'>최신순</label>
                        <input type="checkbox" name="latest" value='latest' ></input>
                        <label htmlFor='oldest' >과거순</label>
                        <input type="checkbox" name="oldest" value='oldest'></input>
                    </li>
                </ul>
                <h4>캠퍼스 정렬</h4>
                <ul>
                    {
                        campuses.map((a, i) => {
                            return (
                                <li key={i}>
                                    <label htmlFor={a.id} key={i}>{a.name}</label>
                                    <input type="checkbox" name={a.id} value={a.name}></input>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <h4>사용자 리스트임</h4>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
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
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={i}>
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
        </div>
    )
}

export default UserList;