import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

const SERVER = process.env.REACT_APP_BACK_BASE_URL

const Main = function () {

    {/* variables */ }
    let navigate = useNavigate()
    const [managerProfileList, setManagerProfileList] = useState([]);

    {/* functions */ }
    useEffect(() => { /* 포스트 목록 바운딩 시 가져오기 */
        const getManagers = async () => {
            try {
                const response = await axios({
                    method: "get",
                    url: SERVER,
                    // headers: { 
                    //     'Authorization': `${session_key}`
                    // },
                });
                console.log(response.data)
                setManagerProfileList(response.data)
            } catch (error) {
                console.log(error);
            }
        }
        getManagers();
    }, []);
    return (
        <div>
            {
                managerProfileList.map((mp) => {
                    return (
                        // 아직 route정의한 게 없어서 오류 : 나중에 주석 풀면 됩니다.
                        // <div onClick={
                        //     navigate(`/profile/${mp.manager_username}`)
                        // }>  
                        <div>
                            <img src={`SERVER${mp.profile_img_path}`} />
                            <div>
                                {mp.campus}
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
};

export default Main;