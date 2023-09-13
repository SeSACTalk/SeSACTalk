import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from 'axios';

import {checkAuthMiddleware} from "../../middleware/middleware";
import { getCookie } from "../../modules/handle_cookie";

const SERVER = process.env.REACT_APP_BACK_BASE_URL

export const Replys = function(){
    const navigate=useNavigate()
    const {p_sq}  = useParams();
    const SERVER_REPLY = `${SERVER}/reply/${p_sq}`
    const session_key = getCookie('session_key')
    
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
    const [ReplyDatas, setReplayDatas] = useState('');
    useEffect(() => {
        async function replysGetRequest() {
            try {
                const response = await axios.get(SERVER_REPLY, {
                    headers: {
                        'Authorization': `${session_key}`
                    }
                });
                setReplayDatas(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        replysGetRequest();
    },[]);
    
    return (
        <div>
            {console.log(ReplyDatas)}
        {ReplyDatas && ReplyDatas.map((item, index) => (
        <div key={index}>
            <Reply reply={item}></Reply>
        </div>
        ))}

        <WriteReply p_sq={p_sq} SERVER_REPLY={SERVER_REPLY} session_key={session_key}></WriteReply>
        </div>
    );
}

const Reply = function(props){
    const navigate=useNavigate()
    const { p_sq } = useParams();
    const r_sq = props.reply.reply.id
    const SERVER_REPLY_DETAIL = `${SERVER}/reply/${p_sq}/${r_sq}`
    const session_key = getCookie('session_key')

    const [replyText, setReplyText] = useState('edit contents btn click');
    
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

    //delete 요청 처리
    async function replyDeleteRequest() {
        axios.delete(SERVER_REPLY_DETAIL, {
            headers: {
                'Authorization': `${session_key}`,
            },
        })
        .then((response) => {
            // DELETE 요청이 성공한 경우
            // response를 이용한 추가 처리
            console.log('DELETE 요청이 성공했습니다.');
            navigate(`/reply/${p_sq}`); // 이동하려는 페이지 경로로 변경
        })
        .catch((error) => {
            // DELETE 요청이 실패한 경우
            console.error('데이터 삭제 중 오류:', error);
        });
    }

    //put 요청 처리
    async function replyEditRequest() {
        await axios({
            method: "put",
            url: SERVER_REPLY_DETAIL,
            data: replyText,
            headers: {
                'Content-Type': "application/json",
                'Authorization': `${session_key}`
            },
        })
            .then(response => {
                console.log(response.data);
                navigate(`/reply/${p_sq}`);
            })
            .catch(error => {
                console.log(error.response.data);
            });
    }

    return(
        <div>
            {/* item.reply와 item.profile에 대한 데이터 사용 */}
            {props.reply && props.reply.profile && props.reply.reply &&(
                <div>
                    <div>
                        <p>Profile Content: {props.reply.profile.name}</p>
                        <p>Profile Content: {props.reply.profile.first_course__campus__name}캠퍼스</p>
                        <p>isReplyMine: {props.reply.isReplyMine}</p>

                        <p>Reply: {props.reply.reply.content}</p>
                    </div>
                    
                    <div>
                        <button onClick={replyDeleteRequest}>delete</button>
                        <button onClick={replyEditRequest}>edit</button>
                    </div>
                </div>
            )}

        </div>
    )
}

const WriteReply= function({ p_sq, SERVER_REPLY, session_key }){
    const navigate=useNavigate()
    const [replyText, setReplyText] = useState('');

    const handleReplyTextChange = (e) => {
        setReplyText(e.target.value);
    };

    async function replyPostRequest(e) {
        e.preventDefault(); 
        try {
            const response = await axios.post(SERVER_REPLY, 
                { replyText: replyText },
                { headers: {
                    'Content-Type': "application/json",
                    'Authorization': `${session_key}`
                    },
                }
            );
            navigate(`/reply/${p_sq}`); // 이동하려는 페이지 경로로 변경
        } catch (error) {
            console.error('Error posting data:', error);
        }
    }

    return(
        <div>
            <form onSubmit={replyPostRequest}>
                <textarea
                    value={replyText}
                    onChange={handleReplyTextChange}
                    placeholder="댓글을 입력하세요"
                />
                <button type="submit">제출</button>
            </form>
        </div>
    )

}


