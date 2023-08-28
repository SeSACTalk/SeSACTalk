import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import checkAuthMiddleware from "../../middleware/checkAuth";
import { getCookie } from "../../modules/handle_cookie";

const SERVER = process.env.REACT_APP_BACK_BASE_URL


export const Profile=function(){
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
                    <p><strong>isProfileMine:</strong> {profileData.isProfileMine}</p>

                    {profileData.isProfileMine ==='True' ? (<button onClick={handleEditButtonClick}>Edit</button>) : (<button>following</button>)}

                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export const EditProfile=function(){
    const navigate = useNavigate()
    const {username} = useParams()
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


    ////////////////////////////////////////////////////////////////////////////////
    const [editProfileUserData, setEditProfileUserData] = useState(null);
    const session_key = getCookie('session_key') 

    const [name, set_name] = useState('');
    const [birthdate, set_birthdate] = useState('');
    const [phone_number, set_phone_number] = useState('');
    const [email, set_email] = useState('');
    const [password, set_password] = useState('');

    const [imagePath, setImagePath] = useState('');
    const [content, setContent] = useState('');
    const [link, setLink] = useState('');
    const [course_status, set_course_status] = useState('');

    const [first_course, set_first_course] = useState('');
    const [first_course_campus_name, set_first_course_campus_name] = useState('');
    const [second_course, set_second_course] = useState('');
    const [second_course_campus_name, set_second_course_campus_name] = useState('');


    const handleNameInputChange = (event) => {
        set_name(event.target.value);
        // console.log(`event : ${event.target.value}, useState : ${name}`);
    };
    const handleBirthdateInputChange = (event) => {
        set_birthdate(event.target.value);
        const upatedUserData = {...editProfileUserData, birthdate: birthdate}
        setEditProfileUserData(upatedUserData)
        console.log(upatedUserData)
        console.log(editProfileUserData)
    };
    const handlePhoneNumberInputChange = (event) => {
        set_phone_number(event.target.value);
        const upatedUserData = {...editProfileUserData, phone_number: phone_number}
        setEditProfileUserData(upatedUserData)
        // console.log(`event : ${event.target.value}, useState : ${phone_number}`);
    };
    const handleEmailInputChange = (event) => {
        set_email(event.target.value);
        const upatedUserData = {...editProfileUserData, email: email}
        setEditProfileUserData(upatedUserData)
        // console.log(`event : ${event.target.value}, useState : ${email}`);
    };
    const handlePasswordInputChange = (event) => {
        set_password(event.target.value);
        const upatedUserData = {...editProfileUserData, password: password}
        setEditProfileUserData(upatedUserData)
        // console.log(`event : ${event.target.value}, useState : ${password}`);
    };

    const handleImagePathInputChange = (event) => {
        setImagePath(event.target.value);
        const upatedUserData = {...editProfileUserData, imagePath: imagePath}
        setEditProfileUserData(upatedUserData)
        // console.log(`event : ${event.target.value}, useState : ${password}`);
    };
    const handleContentInputChange = (event) => {
        setContent(event.target.value);
        const upatedUserData = {...editProfileUserData, content: content}
        setEditProfileUserData(upatedUserData)
        // console.log(`event : ${event.target.value}, useState : ${password}`);
    };
    const handleLinkInputChange = (event) => {
        setLink(event.target.value);
        const upatedUserData = {...editProfileUserData, link: link}
        setEditProfileUserData(upatedUserData)
        // console.log(`event : ${event.target.value}, useState : ${password}`);
    };
    const handleCourseStatusInputChange = () => {
        set_course_status(!course_status);
        const upatedUserData = {...editProfileUserData, course_status: course_status}
        setEditProfileUserData(upatedUserData)
        console.log(`updated : ${upatedUserData.course_status}, useState : ${course_status}`);
    };

    const handleSecondCourseInputChange = (event) => {
        set_second_course(event.target.value);
        const upatedUserData = {...editProfileUserData, second_course: second_course}
        setEditProfileUserData(upatedUserData)
        // console.log(`event : ${event.target.value}, useState : ${password}`);
    };
    const handleSecondCourseCampusNameInputChange = (event) => {
        set_second_course_campus_name(event.target.value);
        const upatedUserData = {...editProfileUserData, second_course_campus_name: second_course_campus_name}
        setEditProfileUserData(upatedUserData)
        // console.log(`event : ${event.target.value}, useState : ${password}`);
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(editProfileUserData);
        const _= await axios({
            method: "put",
            url: SERVER_PROFILE_EDIT,
            data: {
                'editProfileUserData' : editProfileUserData,
            },
            headers: { 
                'Content-Type': "application/json",
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
                const response = await axios.get(SERVER_PROFILE_EDIT,{
                    headers: {
                        'Authorization': `${session_key}`
                    }
                });

                if (response.status === 200) {
                    const data = response.data;
                    console.log(data)
                    setEditProfileUserData(data); 
                    set_name(data.username)
                    set_birthdate(data.birthdate)
                    set_phone_number(data.phone_number)
                    set_email(data.email)
                    set_password("*****")

                    setImagePath(data.img_path)
                    setContent(data.content)
                    setLink(data.link)
                    set_course_status(JSON.parse(data.course_status))

                    set_first_course(data.first_course)
                    set_first_course_campus_name(data.first_course_campus_name)
                    set_second_course(data.second_course)
                    set_second_course_campus_name(data.second_course_campus_name)
                } else {
                    console.error('Error fetching edit profile data');
                }
            } catch (error) {
                console.error('Error fetching edit profile data:', error);
            }
        }
        fetchData();
    }, [username]); // username을 종속성 배열에 추가

    return(
        <div>
            { editProfileUserData ? (
                <div>
                    <h1>프로필...</h1>
                    <form onSubmit = {handleSubmit}>
                        <label>
                        아이디 :
                        <input
                            type="text"
                            name="username"
                            value={editProfileUserData.username}
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
                            onChange={handlePasswordInputChange}
                        />
                        </label>
                        <br />
                        <label>
                        생년월일:
                        <input
                            type="date"
                            name="birthdate"
                            value={birthdate}
                            onChange={handleBirthdateInputChange}
                        />
                        </label>
                        <br />
                        <label>
                        연락처 :
                        <input
                            type="text"
                            name="phoneNumber"
                            value={phone_number}
                            onChange={handlePhoneNumberInputChange}
                        />
                        </label>
                        <br />
                        <label>
                        이메일 :
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleEmailInputChange}
                        />
                        </label>
                        <br />

                        <label htmlFor="profile_content">Profile Content:</label>
                        <textarea id="profile_content" name="profile_content" value={content} onChange={(e) => handleContentInputChange} />
                        <br />
                        <label htmlFor="profile_link">Profile Link:</label>
                        <input type="url" id="profile_link" name="profile_link" value={link} onChange={(e) => handleLinkInputChange} />
                        <br />
                        <label htmlFor="course_status">Course Status:</label>
                        <input type="checkbox" id="course_status" name="course_status" checked={course_status} onChange={handleCourseStatusInputChange} />
                        <br />
                        <label htmlFor="profile_image">Profile Img:</label>
                        <input type="" id="profile_image" name="profile_image" value={imagePath} onChange={(e) => handleImagePathInputChange} />
                        <br />

                        {/* <select name='firstCourse' value={firstCourse} onChange={(e) => setFirstCourseName}>
                            <CourseOptions courseList={courseList.first} />
                        </select>
                        <br />
                        <select name='secondCourse' value={secondCourse} onChange={(e) => setSecondCourseName}>
                            <CourseOptions courseList={courseList.second} />
                        </select>
                        <br /> */}

                        <button type="submit">완료</button>
                    </form>

                    <div>
                        <h1>***UserProfile***</h1>
                        <p><strong>id:</strong> {editProfileUserData.id}</p>
                        <p><strong>username:</strong> {editProfileUserData.username}</p>
                        <p><strong>name:</strong> {editProfileUserData.name}</p>
                        <p><strong>birthdate:</strong> {editProfileUserData.birthdate}</p>
                        <p><strong>phone_number:</strong> {editProfileUserData.phone_number}</p>
                        <p><strong>email:</strong> {editProfileUserData.email}</p>
                        <p><strong>password:</strong> {editProfileUserData.password}</p>

                        <p><strong>first_course:</strong> {editProfileUserData.first_course}</p>
                        <p><strong>second_course:</strong> {editProfileUserData.second_course}</p>
                        
                        <p><strong>img_path:</strong> {editProfileUserData.img_path}</p>
                        <p><strong>content:</strong> {editProfileUserData.content}</p>
                        <p><strong>link:</strong> {editProfileUserData.link}</p>
                        <p><strong>course_status:</strong> {editProfileUserData.course_status}</p>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}

        </div>
    );
}