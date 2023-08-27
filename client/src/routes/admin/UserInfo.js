import React, { useEffect, useState } from "react"
import axios from "axios"

const AdminUserInfo = function () {
    const [users, setUsers] = useState([])
    const [campuses, setCampuses] = useState([])
    const [auth, setAuth] = useState(0)
    const [auth_status, setStatus] = useState(['가입', '승인', '보류', '거절'])
    const [filter_data, setFilterData] = useState({
        'username': '',
        'campus': 0,
        'approvaldate': '',
        'is_auth': 0,
    })

    const SERVER = process.env.REACT_APP_BACK_BASE_URL
    const SERVER_AUTH_REQUEST = `${SERVER}/admin/auth/user/?username=${filter_data['username']}&campus=${filter_data['campus']}&date=${filter_data['approvaldate']}&auth=${filter_data['is_auth']}`
    useEffect(() => {
        axios.get(SERVER_AUTH_REQUEST)
            .then(
                response => {
                    // 사용자 리스트 복사
                    let list_copy = [...response.data.list]
                    list_copy.forEach((a, i) => {
                        if (a.is_auth == 0) {
                            a.is_auth = auth_status[0]
                        } else if (a.is_auth == 20) {
                            a.is_auth = auth_status[2]
                        } else if (a.is_auth == 30) {
                            a.is_auth = auth_status[3]
                        }
                    })
                    setUsers(list_copy)

                    // 캠퍼스 리스트 복사
                    let campus_copy = [...response.data.campus]
                    setCampuses(campus_copy)
                })
            .catch(
                error => {
                    console.error(error)
                })
    }, [filter_data])

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
            <div>
                <h4>날짜순 정렬</h4>
                <ul>
                    <li>
                        <label for='latest'>최신순</label>
                        <input type="checkbox" name="latest" value='latest' onClick={e => {
                            let copy = filter_data
                            copy['date'] = 'latest'
                            setFilterData(copy)
                        }}></input>
                        <label for='oldest' onClick={e => {
                            let copy = filter_data
                            copy['date'] = 'oldest'
                            setFilterData(copy)
                        }}>과거순</label>
                        <input type="checkbox" name="oldest" value='oldest'></input>
                    </li>
                </ul>
                <h4>권한순 정렬</h4>
                <ul>
                    <li>
                        {
                            auth_status.map((a, i) => {
                                return (
                                    <>
                                        <label htmlFor={`status${i}`} key={i}>{a}</label>
                                        <input type="checkbox" name={`status${i}`} value={a}></input>
                                    </>
                                )
                            })
                        }
                    </li>
                </ul>
                <h4>캠퍼스 정렬</h4>
                <ul>
                    <li>
                        {
                            campuses.map((a, i) => {
                                return (
                                    <>
                                        <label for={a.id}>{a.name}</label>
                                        <input type="checkbox" name={a.id} value={a.name}></input>
                                    </>
                                )
                            })
                        }
                    </li>
                </ul>
            </div>
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