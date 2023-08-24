import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"

const AdminUserInfo = function () {
    const SERVER = process.env.REACT_APP_BACK_BASE_URL
    const SERVER_AUTH_REQUEST = `${SERVER}/admin/auth/user/`

    const [users, setUsers] = useState([])
    const [auth, setAuth] = useState(0)
    const [auth_status, setStatus] = useState(['가입', '승인', '보류', '거절'])

    useEffect(() => {
        axios.get(SERVER_AUTH_REQUEST)
            .then(
                response => {
                    let copy = [...response.data]
                    copy.forEach((a, i) => {
                        if (a.is_auth == 0) {
                            a.is_auth = auth_status[0]
                        } else if (a.is_auth == 1) {
                            a.is_auth = auth_status[1]
                        } else if (a.is_auth == 2) {
                            a.is_auth = auth_status[2]
                        } else {
                            a.is_auth = auth_status[3]
                        }
                    })
                    setUsers(copy)
                })
            .catch(
                error => {
                    console.error(error)
                })
    }, [])

    const handleUserAuth = async (e) => {
        e.preventDefault()
        let user_id = e.target.dataset.id
        try {
            const response = await axios.put(SERVER_AUTH_REQUEST, {
                id: user_id,
                is_auth: auth
            })
        }
        catch (error) {
            console.error('Please Try Again', error.response.data)
        }
    }

    return (
        <div className="relative overflow-x-auto m-auto">
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
                                <td><button data-id={a.id} onClick={
                                    handleUserAuth
                                }>전송</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div >
    )
}
export default AdminUserInfo