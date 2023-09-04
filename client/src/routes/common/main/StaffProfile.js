import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const StaffProfile = function () {
    // states
    const [managerProfileList, setManagerProfileList] = useState([]);

    const SERVER = process.env.REACT_APP_BACK_BASE_URL

    // 관리자 프로필 받아오기
    useEffect(() => {
        axios.get(SERVER)
            .then(
                response => {
                    let copy = [...response.data]
                    setManagerProfileList(copy)
                }
            )
            .catch(
                error => console.error(error)
            )
    }, []);

    return (
        <>
            <h2 className='hidden'>관리자 프로필</h2>
            <ul className='staff_profile px-2 py-5 flex gap-8 border-solid border-b border-gray-300 '>
                {
                    managerProfileList.map((element, i) => {
                        return (
                            <li className='w-30' key={i}>
                                <Link to={element.manager_username}>
                                    <div className='img_wrap p-2 border-4 border-double rounded-full border-gray-200'>
                                        <img src={SERVER + element.profile_img_path} alt={element.campus} />
                                    </div>
                                    <p className='mt-1 text-xs text-center'>{element.campus} 캠퍼스</p>
                                </Link>
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

export default StaffProfile