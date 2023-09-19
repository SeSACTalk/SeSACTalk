import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import {checkAuthMiddleware} from "../../middleware/middleware"
import { getCookie } from "../../modules/handle_cookie";

const SERVER = process.env.REACT_APP_BACK_BASE_URL


export const Profile = function () {
    const navigate = useNavigate()
    const { username } = useParams()
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
                const response = await axios.get(SERVER_USER_PROFILE, {
                    headers: {
                        'Authorization': `${session_key}`
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

    const handleEditButtonClick = () => {
        navigate('edit');
    };

    return (
        // fields=('img_path','content',"link","date", "course_status","user")
        <div>
            {profileData ? (
                <div>
                    <h1>User Profile</h1>
                    <p><strong>img_path:</strong> {profileData.img_path}</p>
                    <p><strong>content:</strong> {profileData.content}</p>
                    <p><strong>link:</strong> {profileData.link}</p>
                    <p><strong>date:</strong> {profileData.date}</p>
                    <p><strong>course_status:</strong> {profileData.course_status}</p>
                    <p><strong>user:</strong> {profileData.user}</p>
                    <p><strong>isProfileMine:</strong> {profileData.isProfileMine}</p>

                    {profileData.isProfileMine === 'True' ? (<button onClick={handleEditButtonClick}>Edit</button>) : (<button>following</button>)}

                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export const EditProfile = function () {
    const navigate = useNavigate()
    const [campusList, setCampusList] = useState([])
    const [courseList, setCourseList] = useState({ first: [], second: [] })

    const { username } = useParams()
    const SERVER_PROFILE_EDIT = `${SERVER}/profile/${username}/edit/`

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

    const requestCoursesByCampus = (selectName, campusId) => { /* 캠퍼스에 해당하는 과정 가져오기 */
        axios.get(SERVER_PROFILE_EDIT, {
            headers: {
                'Authorization': `${session_key}`
            },
            params: {
                campus_id: campusId
            }
        })
            .then(response => {
                setCourseList(prevCourseList => ({
                    ...prevCourseList,
                    [selectName]: response.data.course
                }));
            })
            .catch(error => {
                console.error(error);
            });
    };

    const generateCampusSelectAndOptionsElements = (selectName) => { /* 캠퍼스에 따른 동적 option태그 생성 */
        return (
            <select name={selectName + 'Campus'} onChange={(e) => {
                const selectedCampusId = e.target.value;

                switch (selectedCampusId) {
                    case '':
                        setCourseList(prevCourseList => ({
                            ...prevCourseList,
                            [selectName]: []
                        }));
                        break;
                    default:
                        requestCoursesByCampus(selectName, selectedCampusId);
                        set_second_course__campus__name(selectedCampusId);
                        break;
                }
            }}>
                <option value=''>선택</option>
                {campusList.map((campus) => (
                    <option key={campus.id} value={campus.id}>{campus.name}</option>
                ))}
            </select>
        );
    };


    ////////////////////////////////////////////////////////////////////////////////
    const session_key = getCookie('session_key')

    const [name, set_name] = useState('');
    const [birthdate, set_birthdate] = useState('');
    const [phone_number, set_phone_number] = useState('');
    const [email, set_email] = useState('');
    const [password, set_password] = useState('');

    const [profile_img_path, set_profile_img_path] = useState('');
    const [profile_content, set_profile_content] = useState('');
    const [profile_link, set_profile_link] = useState('');
    const [profile_course_status, set_profile_course_status] = useState('');

    const [first_course__name, set_first_course__name] = useState('');
    const [first_course__campus__name, set_first_course__campus__name] = useState('');
    const [second_course__name, set_second_course__name] = useState('');
    const [second_course__campus__name, set_second_course__campus__name] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("birthdate", birthdate);
        formData.append("phone_number", phone_number);
        formData.append("email", email);
        formData.append("password", password);

        formData.append("profile_img_path", profile_img_path);
        formData.append("profile_content", profile_content);
        formData.append("profile_link", profile_link);
        formData.append("profile_course_status", profile_course_status);

        formData.append("second_course__name", second_course__name)
        formData.append("second_course__campus__name", second_course__campus__name)

        console.log("Submit :");
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        const _ = await axios({
            method: "put",
            url: SERVER_PROFILE_EDIT,
            // data: {
            //     'formData' : formData,
            // },
            data: formData,
            headers: {
                'Content-Type': "multipart/form-data",
                'Authorization': `${session_key}`
            },
        })
            .then(response => {
                console.log(response.data);
                navigate(`/profile/${username}`);
            })
            .catch(error => {
                console.log(error.response.data);
            });
    };
    ////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(SERVER_PROFILE_EDIT, {
                    headers: {
                        'Authorization': `${session_key}`
                    }
                });

                if (response.status === 200) {
                    const data = response.data;
                    console.log(`response : ${data.profile.username}`)
                    set_name(data.profile.username)
                    set_birthdate(data.profile.birthdate)
                    set_phone_number(data.profile.phone_number)
                    set_email(data.profile.email)
                    set_password("*****")

                    set_profile_img_path(data.profile.profile_img_path)
                    set_profile_content(data.profile.profile_content)
                    set_profile_link(data.profile.profile_link)
                    set_profile_course_status(JSON.parse(data.profile.profile_course_status))

                    set_first_course__name(data.profile.first_course__name)
                    set_first_course__campus__name(data.profile.first_course__campus__name)
                    set_second_course__name(data.profile.second_course__name)
                    set_second_course__campus__name(data.profile.second_course__campus__name)

                    setCampusList(data.campus);
                } else {
                    console.error('Error fetching edit profile data');
                }
            } catch (error) {
                console.error('Error fetching edit profile data:', error);
            }
        }
        fetchData();
    }, []); // username을 종속성 배열에 추가

    return (
        <div>
            <div>
                <h1>프로필...</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        아이디 :
                        <input
                            type="text"
                            name="username"
                            value={name}
                            disabled={true}
                        />
                    </label>
                    <br />
                    <label>
                        비밀번호 :
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => set_password(e.target.value)}
                        />
                    </label>
                    <br />
                    <label>
                        생년월일:
                        <input
                            type="date"
                            name="birthdate"
                            value={birthdate}
                            onChange={(e) => set_birthdate(e.target.value)}
                        />
                    </label>
                    <br />
                    <label>
                        연락처 :
                        <input
                            type="text"
                            name="phoneNumber"
                            value={phone_number}
                            onChange={(e) => set_phone_number(e.target.value)}
                        />
                    </label>
                    <br />
                    <label>
                        이메일 :
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => set_email(e.target.value)}
                        />
                    </label>
                    <br />

                    <label htmlFor="profile_content">Profile Content:</label>
                    <textarea id="profile_content" name="profile_content" value={profile_content} onChange={(e) => set_profile_content(e.target.value)} />
                    <br />
                    <label htmlFor="profile_link">Profile Link:</label>
                    <input type="url" id="profile_link" name="profile_link" value={profile_link} onChange={(e) => set_profile_link(e.target.value)} />
                    <br />
                    <label htmlFor="profile_course_status">Course Status:</label>
                    <input type="checkbox" id="profile_course_status" name="profile_course_status" checked={profile_course_status} onChange={() => set_profile_course_status(!profile_course_status)} />
                    <br />

                    <label htmlFor="profile_img_path">Profile Img:</label>
                    <input type="file" id="profile_img_path" name="profile_img_path" accept="image/png, image/jpeg, image/jpg" onChange={(e) => set_profile_img_path(e.target.files[0])} />
                    {profile_img_path && <img src={SERVER + profile_img_path} alt="Profile_Img" />}
                    <br />

                    <label>
                        과정1 :
                        <input
                            type="text"
                            name="first_course__campus__name"
                            value={first_course__campus__name}
                            disabled={true}
                        />
                        <input
                            type="text"
                            name="first_course__name"
                            value={first_course__name}
                            disabled={true}
                        />
                    </label>
                    <br />

                    {generateCampusSelectAndOptionsElements('second')}
                    <select name='second_course__name' value={second_course__name} onChange={(e) => set_second_course__name(e.target.value)}>
                        <CourseOptions courseList={courseList.second} />
                    </select>
                    <br />

                    <button type="submit">완료</button>
                </form>
            </div>
        </div>
    );
}

function CourseOptions({ courseList }) {
    return (
        <>
            <option value=''>선택</option>
            {courseList.map((course) => (
                <option key={course.id} value={course.id}>{course.name}</option>
            ))}
        </>
    );
}