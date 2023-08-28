import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from 'axios';

import checkAuthMiddleware from "../../middleware/checkAuth";

const SERVER = process.env.REACT_APP_BACK_BASE_URL

export const Replys = function(){
    const navigate=useNavigate()
    const { u_sq, p_sq } = useParams();
    const SERVER_REPLY = `${SERVER}/reply/${u_sq}/${p_sq}`
    
    const redirectToLogin = () => {
        navigate('/accounts/login'); // 로그인 페이지로 이동
    };
    useEffect(() => {
        checkAuthMiddleware()
        .then(() => {
        })
        .catch(() => {
            redirectToLogin();
        });
    }, []);
    
    // get 요청 처리
    const [ReplyDatas, setReplayDatas] = useState(null); 
    useEffect(() => {
        async function replysGetRequest() {
            try {
                const response = await axios.get(SERVER_REPLY);
                setReplayDatas(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        replysGetRequest();
    },[]);
    
    return (
        <div className="App">
            {ReplyDatas && (
                <div>
                    <p>u_sq: {ReplyDatas.u_sq}</p>
                    <p>p_sq: {ReplyDatas.p_sq}</p>
                </div>
            )}
        </div>
    );
}

export const Reply = function(){
    const navigate=useNavigate()
    const { u_sq, p_sq } = useParams();
    const SERVER_REPLY = `${SERVER}/reply/${u_sq}/${p_sq}`
    
    const redirectToLogin = () => {
        navigate('/accounts/login'); // 로그인 페이지로 이동
    };
    useEffect(() => {
        checkAuthMiddleware()
        .then(() => {
        })
        .catch(() => {
            redirectToLogin();
        });
    }, []);

    //post 요청 처리
    const [ReplyData, setReplayData] = useState(null); 
    async function postPostRequest() {
        try {
            const response = await axios.post(SERVER_REPLY, { data: ReplyData });
            // POST 요청 후 처리할 내용
        } catch (error) {
            console.error('Error posting data:', error);
        }
    }

}


