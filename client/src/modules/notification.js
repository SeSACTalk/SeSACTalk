import React, { useState, useEffect } from 'react';
import axios from 'axios';
import firebase from 'firebase/app'
import 'firebase/messaging'

const GetFcmToken = () => {
    const [fcmToken, setFcmToken] = useState(null)

    useEffect(() => {
        const firebaseConfig = {
            apiKey: process.env.REACT_APP_API_KEY,
            authDomain: process.env.REACT_APP_AUTH_DOMAIN,
            databaseURL: process.env.REACT_APP_API_KEY,
            projectId: process.env.REACT_APP_PRJECT_ID,
            storageBucket: process.env.REACT_APP_SOTRAGE_BUCKET,
            messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
            appId: REACT_APP_APP_ID,
            measurementId: REACT_APP_MESUREMNET_ID
        }
        
        firebase.initializeApp(firebaseConfig) // firebase 초기화

        // FCM 토큰 얻기
        const messaging = firebase.messaging();
        messaging.getToken().then(
            token => setFcmToken(token)
        )
    }, []);
}

const handleSendNotification = async () => {
    if (fcmToken) {
        try {
            const response = await axios.post('', {
                fcm_token: fcmToken
            })
        }
        catch (error) {
            console.error('Error', error)
        }
    } else {
        console.error('FCM token not available')
    }
}

export { handleSendNotification, GetFcmToken }