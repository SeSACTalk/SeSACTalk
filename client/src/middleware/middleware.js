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
                    'Authorization': session_key
                }
            });
            if (response.status === 200) {
                return Promise.resolve();
            } else {
                return Promise.reject();
            }
        } catch (error) {
            return Promise.reject();
        }
    } else {
        return Promise.reject();
    }
}

const checkInfoMiddleware = async () => {
    const SERVER = process.env.REACT_APP_BACK_BASE_URL
    const SERVER_ACCOUNTS_INFO = SERVER + '/accounts/user/info/'

    const session_key = getCookie('session_key');

    try {
        const response = await axios.post(SERVER_ACCOUNTS_INFO, null, {
            headers: {
                'Authorization': session_key
            }
        });
        const role = response.data.role;
        if (response.status === 200) {
            switch (role) {
                case 'STAFF':
                    return Promise.resolve();
                case 'USER':
                    return Promise.reject();
                default:
                    return Promise.reject();
            }
        }
    } catch (error) { // 비회원
        return Promise.reject();
    }
}

export { checkAuthMiddleware, checkInfoMiddleware }