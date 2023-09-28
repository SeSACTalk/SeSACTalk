import React, { useEffect, useState } from "react"
import axios from "axios"

const UserInfo = function () {
    const [users, setUsers] = useState([])
    const [campuses, setCampuses] = useState([])
    const [auth, setAuth] = useState(0)
    const [auth_status, setStatus] = useState(['가입', '승인', '보류', '거절'])

    useEffect(() => {
        axios.get(`/admin/auth/user/?username=&campus=&date=&auth=`)
            .then(
                response => {
                    // 사용자 리스트 복사
                    let list_copy = [...response.data.list]
                    setUsers(list_copy)

                    // 캠퍼스 리스트 복사
                    let campus_copy = [...response.data.campus]
                    setCampuses(campus_copy)
                })
            .catch(
                error => {
                    console.error(error)
                })
    }, [])

    return (
        <div className="user_container w-4/5 p-10">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead>
                    <tr>
                        <th scope="col" className="px-6 py-3">이름</th>
                        <th scope="col" className="px-6 py-3">캠퍼스</th>
                        <th scope="col" className="px-6 py-3">과정명</th>
                        <th scope="col" className="px-6 py-3">가입일</th>
                        <th scope="col" className="px-6 py-3">상태</th>
                        <th scope="col" className="px-6 py-3">수정여부</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((a, i) => {
                        return (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={i}>
                                <td className="px-6 py-4">{a.name}</td>
                                <td className="px-6 py-4">{a.first_course.campus.name}</td>
                                <td className="px-6 py-4">{a.first_course.name}</td>
                                <td className="px-6 py-4">{a.signup_date}</td>
                                <td className="px-6 py-4">
                                    <select defaultValue={a.is_auth} onChange={e => setAuth(e.target.value)}>
                                        {
                                            auth_status.map((element, i) => {
                                                return (
                                                    <option value={i} key={i}>{element}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </td>
                                <td><button data-id={a.id}>전송</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div >
    )
}
export default UserInfo