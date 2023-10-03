import React, { useEffect, useState } from "react"
import axios from "axios"

const UserVerify = function () {
    const [users, setUsers] = useState([]); // 사용자 리스트
    const [campuses, setCampuses] = useState([]); // 캠퍼스필터
    const [username, setUsername] = useState(''); // 사용자명
    const [campusName, setCampusName] = useState(''); // 캠퍼스명
    const [date, setDate] = useState(''); // 날짜기반
    const [auth, setAuth] = useState('');

    useEffect(() => {
        axios.get(`/admin/auth/user/?name=${username}&campus=${campusName}&date=${date}&auth=${auth}`)
            .then(
                response => {
                    // 사용자 리스트 복사
                    let list_copy = [...response.data.list]
                    setUsers(list_copy)
                    console.log(list_copy)

                    // 캠퍼스 리스트 복사
                    let campus_copy = [...response.data.campus]
                    setCampuses(campus_copy)
                })
            .catch(
                error => {
                    console.error(error)
                })
    }, [username + campusName + date + auth])

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
                    <select
                        className="border border-black h-6"
                        defaultValue=''
                        onChange={(e) => { setAuth(e.target.value) }}>
                        <option value=''>권한</option>
                        <option value='10'>가입</option>
                        <option value='20'>보류</option>
                        <option value='30'>거절</option>
                    </select>
                    <label className="hidden" htmlFor="latest">가입신청날짜</label>
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
                        <th scope="col" className="px-6 py-3">연락처</th>
                        <th scope="col" className="px-6 py-3">캠퍼스</th>
                        <th scope="col" className="px-6 py-3">과정명</th>
                        <th scope="col" className="px-6 py-3">가입일</th>
                        <th scope="col" className="px-6 py-3">상태</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((element, i) => {
                            return (
                                <tr className="border-b" key={i}>
                                    <td className="px-6 py-4">{element.name}</td>
                                    <td className="px-6 py-4">{element.phone_number}</td>
                                    <td className="px-6 py-4">{element.first_course.campus.name}</td>
                                    <td className="px-6 py-4">{element.first_course.name}</td>
                                    <td className="px-6 py-4">{element.signup_date}</td>
                                    <td className="px-6 py-4">
                                        <select defaultValue={element.is_auth}>
                                            <option value={element.is_auth}>가입</option>
                                            <option value="10">승인</option>
                                            <option value="20">보류</option>
                                            <option value="30">거절</option>
                                        </select>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}
export default UserVerify;