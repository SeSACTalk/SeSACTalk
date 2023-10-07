import React, { useEffect, useState } from 'react'
import axios from 'axios'

const CourseApproval = function () {
    const [users, setUsers] = useState([]); // 사용자 리스트
    const [campuses, setCampuses] = useState([]); // 캠퍼스필터
    const [username, setUsername] = useState(''); // 사용자명
    const [campusName, setCampusName] = useState(''); // 캠퍼스명

    useEffect(() => {
        axios.get(`/admin/user/course?name=${username}&campus=${campusName}`)
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
    }, [username, campusName])

    // 과정 추가 승인 함수
    const approvalCoruse = async (e) => {
        e.preventDefault();
        e.target.value = Number(e.target.value)
        let status;
        if (Number(e.target.value)) {
            status = true;
        } else {
            status = false;
        }
        try {
            const response = await axios.put('/admin/user/course/', {
                id: e.target.dataset.id,
                course_status: true,
                status: status
            });
            window.location.href = ''
        }
        catch (error) {
            console.error(error)
        }
    }

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
                        <th scope="col" className="px-6 py-3">아이디</th>
                        <th scope="col" className="px-6 py-3">캠퍼스</th>
                        <th scope="col" className="px-6 py-3">과정명</th>
                        <th scope="col" className="px-6 py-3">상태</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((element, i) => {
                            return (
                                <tr className="border-b" key={i}>
                                    <td className="px-6 py-4">{element.name}</td>
                                    <td className="px-6 py-4">{element.username}</td>
                                    <td className="px-6 py-4">{element.campus_name}</td>
                                    <td className="px-6 py-4">{element.course_name}</td>
                                    <td className="px-6 py-4">
                                        <select defaultValue=""
                                            data-id={element.id}
                                            onChange={approvalCoruse}>
                                            <option value="">선택</option>
                                            <option value="1">승인</option>
                                            <option value="0">거절</option>
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

export default CourseApproval;