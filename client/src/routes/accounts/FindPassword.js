import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

const SERVER = process.env.REACT_APP_BACK_BASE_URL
const SERVER_ACCOUNTS_FIND_PASSWORD = SERVER + '/accounts/find/user/password/'

const FindPassword = function () {
    {/* 
        TODO: 프론트 전달 사항
        
    */}

    {/* variables */ }
    let navigate = useNavigate()

    {/* form variables */ }
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    {/* functions */ }
    const findPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(SERVER_ACCOUNTS_FIND_PASSWORD, {
                username: username,
                email: email
            })
            console.log(response.data);
            navigate('accounts/login');
        } catch (error) {
            console.error(error.response.data);
        }
    }


    return (
        <div>
            <form onSubmit={findPassword}>
                <table>
                    <tr>
                        {/* 아이디 */}
                        <td>아이디</td>
                        <td><input type="text" name='username' placeholder='아이디를 입력하세요' value={username} onChange={(e) => setUsername(e.target.value)} /></td>
                    </tr>
                    <tr>
                        {/* 비밀번호 */}
                        <td>이메일</td>
                        <td><input type="text" name='email' placeholder='이메일 입력하세요' value={email} onChange={(e) => setEmail(e.target.value)} /></td>
                    </tr>
                    <input type='submit' value="비밀번호 찾기" />
                </table>
            </form>
        </div>
    );
};

export default FindPassword;