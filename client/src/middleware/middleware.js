import axios from 'axios'
import { getCookie } from '../modules/handle_cookie'

const checkAuthMiddleware = async () => {

    const session_key = getCookie('session_key');

    if (session_key) {
        try {
            const response = await axios.get('/accounts/user/info');
            if (response.status === 200) {
                console.log(response.data)
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

export { checkAuthMiddleware }