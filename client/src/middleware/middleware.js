import axios from 'axios'
import { getCookie } from '../modules/handle_cookie'

const checkAuthMiddleware = async () => {
    const SERVER = process.env.REACT_APP_BACK_BASE_URL
    const SERVER_ACCOUNTS_VERIFY = SERVER + '/accounts/verify/session/'

    const session_key = getCookie('session_key');

    if (session_key) {
        try {
            const response = await axios.get(SERVER_ACCOUNTS_VERIFY, {
                headers: {
                    'Authorization': `Session ${session_key}`
                }
            });
            if (response.status === 200) {
                console.log('인증된 사용자입니다.')
                return Promise.resolve();
            } else {
                console.error('인증되지 않은 사용자입니다.', response.status)
                return Promise.reject();
            }
        } catch (error) {
            console.error('인증되지 않은 사용자입니다.', error)
            return Promise.reject();
        }
    } else {
        console.error('세션 키가 없습니다.')
        return Promise.reject();
    }
}

const checkInfoMiddleware = async () => {
    const SERVER = process.env.REACT_APP_BACK_BASE_URL
    const SERVER_ACCOUNTS_INFO = SERVER + '/accounts/user/info/'

    const session_key = getCookie('session_key');
    
    try {
        const response = await axios.post(SERVER_ACCOUNTS_INFO, {
            session_key
        });
        if (response.status === 200 && response.data.message == 'True') {
            console.log('관리자입니다.')
            return Promise.resolve();
        } else {
            console.log('일반사용자입니다.')
            return Promise.reject();
        }
    } catch (error) {
        console.error('인증되지 않은 사용자입니다.', error)
        return Promise.reject();
    }
}

export { checkAuthMiddleware, checkInfoMiddleware }
