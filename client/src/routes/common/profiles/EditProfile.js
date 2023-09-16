import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { checkAuthMiddleware } from "../../../middleware/middleware"
import { getCookie } from "../../../modules/handle_cookie";

import React from 'react';

const SERVER = process.env.REACT_APP_BACK_BASE_URL
const session_key = getCookie('session_key')

const EditProfile = function () {
    const navigate = useNavigate()
    const { username } = useParams()

    // form data    
    const [name, setName] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [profileImgpath, setProfileImgpath] = useState('');
    const [profileContent, setProfileContent] = useState('');
    const [profileLink, setProfileLink] = useState('');
    const [profileCourseStatus, setProfileCourseStatus] = useState('');

    const [firstCourseName, setFirstCourseName] = useState('');
    const [firstCampusName, setFirstCampusName] = useState('');
    const [secondCourseName, setSecondCourseName] = useState('');
    const [secondCampusName, setSecondCampusName] = useState('');
    const [campusList, setCampusList] = useState([])
    const [courseList, setCourseList] = useState({ first: [], second: [] })

    // url
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
                        setSecondCampusName(selectedCampusId);
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


    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("birthdate", birthdate);
        formData.append("phone_number", phoneNumber);
        formData.append("email", email);
        formData.append("password", password);

        formData.append("profile_img_path", profileImgpath);
        formData.append("profile_content", profileContent);
        formData.append("profile_link", profileLink);
        formData.append("profile_course_status", profileCourseStatus);

        formData.append("second_course__name", secondCourseName)
        formData.append("second_course__campus__name", secondCampusName)

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
                    console.log(`response : ${data.profile}`)
                    setName(data.profile.name)
                    setBirthdate(data.profile.birthdate)
                    setPhoneNumber(data.profile.phone_number)
                    setEmail(data.profile.email)
                    setPassword("*****")

                    setProfileImgpath(data.profile.profile_img_path)
                    setProfileContent(data.profile.profile_content)
                    setProfileLink(data.profile.profile_link)
                    setProfileCourseStatus(JSON.parse(data.profile.profile_course_status))

                    setFirstCourseName(data.profile.first_course__name)
                    setFirstCampusName(data.profile.first_course__campus__name)
                    setSecondCourseName(data.profile.second_course__name)
                    setSecondCampusName(data.profile.second_course__campus__name)

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
        <>
                    <header className="profile_header flex mb-0y min-h-full">
                        {/* 프로필 사진 */}
                        <div className="profile_img_container flex justify-center w-2/6 h-36 ">
                            <div className="profile_img_div w-36 TOP self-center rounded-full overflow-hidden border-4 border-solid border-sesac-green p-2">
                                <img className="block p-2" src={`${SERVER + profileImgpath}`} alt='프로필 이미지' />
                            </div>
                            {/*  */}
                        </div>
                        {/* 
                    이름, 캠퍼스명, 수정, 설정
                    게시물, 팔로워, 팔로우
                    한줄소개
                    링크
                */}
                        <section className="profile_userinfo_container flex flex-col gap-4 w-6/12 h-44 px-1 ">
                            <div className="flex flex-col gap-1">
                                <div className="profile_userinfo flex">
                                    <div>
                                        <h2 className="inline-block font-bold text-2xl mr-3">{name}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col gap-1 text-sm">
                                    <div className="text-sesac-green">한줄소개</div>
                                    <div className="font-semibold">{profileContent}</div>
                                </div>
                                <div className="text-sm">
                                    <div className="text-sesac-green">링크</div>
                                    <div className="font-semibold">{profileLink}</div>
                                </div>
                            </div>
                        </section>
                    </header>
                    {/* 
                게시물, 좋아요, 댓글
            */}
                    <div className="profile_nav flex gap-32 align-middle justify-center border-t-2 border-gray-300 text-base">
                       
                    </div>
                </>
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

export default EditProfile