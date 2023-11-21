import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import {checkAuthMiddleware} from "../../middleware/middleware"
import { getCookie } from "../../modules/handle_cookie";

const SERVER = process.env.REACT_APP_BACK_BASE_URL

const Recruit = function () {
    const navigate = useNavigate()
    const { username } = useParams()
    const SERVER_RECRUIT = `${SERVER}/recruit`

    const session_key = getCookie('session_key')

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(SERVER_RECRUIT, {
                    headers: {
                        'Authorization': `${session_key}`
                    }
                });

                if (response.status === 200) {
                    const data = response.data;
                    console.log(data);
                } else {
                    console.error('Error fetching recruit data');
                }
            } catch (error) {
                console.error('Error fetching recruit data:', error);
            }
        }
        fetchData();
    }, []); 
}

export default Recruit