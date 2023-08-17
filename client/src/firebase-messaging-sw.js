import axios from 'axios'
import { initializeApp } from "firebase/app";
import { getToken, getMessaging, onMessage } from 'firebase/messaging';

import { getCookie } from './modules/handle_cookie';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_API_KEY,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_SOTRAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const SERVER = process.env.REACT_APP_BACK_BASE_URL

async function requestPermission() {

  const permission = await Notification.requestPermission();
  if (permission === "denied") {
    console.log("알림 권한 허용 안됨");
    return;
  }

  console.log("알림 권한이 허용됨");

  const token = await getToken(messaging, {
    vapidKey: process.env.REACT_APP_VAPID_KEY,
  });
  const username = getCookie('username')
  if (username) {
    if (token) {
      try {
        const response = await axios.post(`${SERVER}/user/${username}/notify`, { token: token })
      }
      catch (error) {
        console.error('Fail', error.response.data)
      }
    }
  }

  onMessage(messaging, (payload) => {
    console.log("메시지가 도착했습니다.", payload);
  });
}

requestPermission();