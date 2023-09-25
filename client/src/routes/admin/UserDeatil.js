import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';

const AdminUserDetail = function () {
    const { id } = useParams()
    const [user, setUser] = useState({})

    useEffect(() => {
        axios.get(`/admin/user/${id}`)
            .then(
                response => {
                    let copy = { ...response.data }
                    setUser(copy)
                    console.log(copy)
                }
            )
            .catch(
                error => {
                    console.error(error)
                }
            )
    }, [])

    const handleActiveStatus = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/admin/user/${id}`, {
                id: id,
                is_active: 0
            })
        }
        catch (error) {
            console.error('Please Try Again', error.response.data)
        }

    }

    return (
        <>
            <h4>디테일</h4>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead>
                    <tr>
                        <th scope="col" className="px-6 py-3">이름</th>
                        <th scope="col" className="px-6 py-3">이메일</th>
                        <th scope="col" className="px-6 py-3">성별</th>
                        <th scope="col" className="px-6 py-3">연락처</th>
                        <th scope="col" className="px-6 py-3">가입일</th>
                        <th scope="col" className="px-6 py-3">비활성화</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
                        <td className="px-6 py-4">{user.name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{user.gender}</td>
                        <td className="px-6 py-4">{user.phone_number}</td>
                        <td className="px-6 py-4">{user.signup_date}</td>
                        <td className="px-6 py-4">
                            <button onClick={handleActiveStatus}>
                                비활성화
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default AdminUserDetail