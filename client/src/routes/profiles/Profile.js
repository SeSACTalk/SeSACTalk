import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import checkAuthMiddleware from "../../middleware/checkAuth";
import { getCookie } from "../../modules/handle_cookie";

const SERVER = process.env.REACT_APP_BACK_BASE_URL


const Profile=function(){
    const navigate = useNavigate()
    const {username} = useParams()
    const SERVER_USER_PROFILE = `${SERVER}/profile/${username}`

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

    const [profileData, setProfileData] = useState(null);   
    const session_key = getCookie('session_key') 
    

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(SERVER_USER_PROFILE,{
                    headers: {
                        'Authorization': `Session ${session_key}`
                    }
                });

                if (response.status === 200) {
                    const data = response.data;
                    setProfileData(data); // profileData 설정
                    console.log(data);
                } else {
                    console.error('Error fetching profile data');
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        }
        fetchData();
    }, [username]); // username을 종속성 배열에 추가

    return(
        // fields=('img_path','content',"link","date", "course_status","user")
        <div>
            { profileData ? (
                <div>
                    <h1>User Profile</h1>
                    <p><strong>img_path:</strong> {profileData.img_path}</p>
                    <p><strong>content:</strong> {profileData.content}</p>
                    <p><strong>link:</strong> {profileData.link}</p>
                    <p><strong>date:</strong> {profileData.date}</p>
                    <p><strong>course_status:</strong> {profileData.course_status}</p>
                    <p><strong>user:</strong> {profileData.user}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )


}

export default Profile;