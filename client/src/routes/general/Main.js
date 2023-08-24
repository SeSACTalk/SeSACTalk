import axios from 'axios';
import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js'
import { useNavigate } from 'react-router-dom'

const SERVER = process.env.REACT_APP_BACK_BASE_URL
const SERVER_GENERAL_MAIN = `${SERVER}`

const Main = function () {

    {/* variables */ }
    const [managerProfileList, setManagerProfileList] = useState([]);

    {/* functions */ }
    useEffect(() => { /* 포스트 목록 바운딩 시 가져오기 */
        const getManagers = async () => {
            try {
                const response = await axios({
                method: "get",
                url: SERVER_GENERAL_MAIN,
                // headers: { 
                //     'Authorization': `${session_key}`
                // },
                });
                console.log(response.data)
            } catch (error) {
                console.log(error.response.data);
            }
        }
            getManagers();
    }, []);
    return (
        <div>
            메인페이지
        </div>
    );
};

export default Main;