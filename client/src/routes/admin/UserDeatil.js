import React, { useEffect, useRef, useState, memo } from "react";
import axios from "axios";

const UserDetail = memo(function ({ userId, detail, scroll, setDetail }) {
    /* States */
    const [user, setUser] = useState({});

    /* Refs */
    const modalPopup = useRef()

    /**
     * 모달창 닫기
     * @param {Event} e 
     */
    const closeModal = (e) => {
        if (modalPopup.current === e.target) {
            setDetail(!detail)
        }
    }

    useEffect(() => {
        axios.get(`/admin/user/${userId}`)
            .then(
                response => {
                    let copy = { ...response.data }
                    setUser(copy)
                }
            )
            .catch(
                error => {
                    console.error(error)
                }
            )
    }, [userId])

    if (user.first_course) {
        return (
            <div className="modal detail_modal flex justify-center items-center absolute left-0 w-full h-screen" style={{ top: scroll }} ref={modalPopup} onClick={closeModal}>
                <div className="flex justify-center rounded-lg h-1/2 p-5 bg-zinc-50">
                    <table className="w-full text-sm text-center text-gray-500">
                        <thead>
                            <tr className="border-b">
                                <th scope="col" className="px-6 py-3">이름</th>
                                <th scope="col" className="px-6 py-3">성별</th>
                                <th scope="col" className="px-6 py-3">전화번호</th>
                                {
                                    user.second_course ?
                                        <>
                                            <th scope="col" className="px-6 py-3">캠퍼스1</th>
                                            <th scope="col" className="px-6 py-3">캠퍼스2</th>
                                        </> :
                                        <th scope="col" className="px-6 py-3">캠퍼스</th>
                                }
                                <th scope="col" className="px-6 py-3">가입승인일</th>
                                <th scope="col" className="px-6 py-3">활성화상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="px-6 py-4">{user.name}</td>
                                <td className="px-6 py-4">{user.gender}</td>
                                <td className="px-6 py-4">{user.phone_number}</td>
                                {
                                    user.second_course ?
                                        <>
                                            <td className="px-6 py-4">{user.first_course.name}</td>
                                            <td className="px-6 py-4">{user.second_course.name}</td>
                                        </> :
                                        <td className="px-6 py-4">{user.first_course.name}</td>
                                }
                                <td className="px-6 py-4">{user.auth_approval_date}</td>
                                <td className="px-6 py-4">{user.is_auth}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div >
        )
    }
})

export default UserDetail;