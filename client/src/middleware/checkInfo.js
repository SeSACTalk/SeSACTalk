import axios from 'axios'
import { getCookie } from '../modules/handle_cookie'

const checkInfoMiddleware = async () => {
    const SERVER = process.env.REACT_APP_BACK_BASE_URL
    const SERVER_ACCOUNTS_INFO = SERVER + '/accounts/user/info/'

    const session_key = getCookie('session_key');
    try {
        const response = await axios.post(SERVER_ACCOUNTS_INFO, {
            session_key
        });
        if (response.status === 200) {
            console.log('관리자입니다.')
            return Promise.resolve();
        }
    } catch (error) {
        console.error('일반사용자입니다.', error)
        return Promise.reject();
    }
}
export default checkInfoMiddleware