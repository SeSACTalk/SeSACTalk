import axios from 'axios';
import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js'
import { useNavigate } from 'react-router-dom'

const SERVER = process.env.REACT_APP_BACK_BASE_URL
const SERVER_GENERAL_MAIN = `${SERVER}/`

const Main = function () {

    {/* variables */ }
    const [managerProfileList, setManagerProfileList] = useState([]);

    {/* functions */ }
    useEffect(() => { /* 캠퍼스 목록 바운딩 시 가져오기 */
        axios.get(SERVER_GENERAL_MAIN)
            .then(response => {
                setManagerProfileList(response.data.campus);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);
    return (
        <div>
        </div>
    );
};

export default Main;