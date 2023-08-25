import React, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, Link } from 'react-router-dom';

const AdminAuthedUser = function () {
    const SERVER = process.env.REACT_APP_BACK_BASE_URL
    const SERVER_USER_LIST = `${SERVER}/admin/user/`

    const [users, setUsers] = useState([])

    useEffect(() => {
        axios.get(SERVER_USER_LIST)
            .then(
                response => {
                    let copy = [...response.data]
                    setUsers(copy)
                }
            )
            .catch(
                error => {
                    console.error(error)
                }
            )
    }, [])

    return (
        <>
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
                        users.map((a, i) => {
                            return (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={i}>
                                    <td className="px-6 py-4">
                                        <Link to={`${a.id}`}>{a.name}</Link>
                                    </td>
                                    <td className="px-6 py-4">{a.email}</td>
                                    <td className="px-6 py-4">{a.first_course.campus.name}</td>
                                    <td className="px-6 py-4">{a.first_course.name}</td>
                                    <td className="px-6 py-4">{a.signup_date}</td>
                                    <td className="px-6 py-4">{String(a.is_active)}</td>
                                    <td className="px-6 py-4">{String(a.is_staff)}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <Outlet></Outlet>
        </>
    )
}

export default AdminAuthedUser