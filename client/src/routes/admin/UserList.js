import React, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, Link } from 'react-router-dom';

const AdminAuthedUser = function () {
    const [users, setUsers] = useState([])
    const [campuses, setCampuses] = useState([])
    const [filter_data, setFilterData] = useState({
        'username': '',
        'campus': 0,
        'approvaldate': '',
    })

    const SERVER = process.env.REACT_APP_BACK_BASE_URL
    const SERVER_USER_LIST = `${SERVER}/admin/user/?username=${filter_data['username']}&campus=${filter_data['campus']}&date=${filter_data['approvaldate']}`
    useEffect(() => {
        axios.get(SERVER_USER_LIST)
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
        <>
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
                    <li>
                        {
                            campuses.map((a, i) => {
                                return (
                                    <>
                                        <label htmlFor={a.id} key={i}>{a.name}</label>
                                        <input type="checkbox" name={a.id} value={a.name}></input>
                                    </>
                                )
                            })
                        }
                    </li>
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