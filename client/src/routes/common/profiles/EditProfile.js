import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { getCookie } from "../../../modules/handle_cookie";

import React from 'react';
import CryptoJS from 'crypto-js'
import { type } from "@testing-library/user-event/dist/type";
import { disable } from "workbox-navigation-preload";

const SERVER = process.env.REACT_APP_BACK_BASE_URL
const session_key = getCookie('session_key')

const EditProfile = function () {
    const navigate = useNavigate();
    const { username } = useParams();

    const [contentLength, setContentLength] = useState(0);
    const [editProfileImg, setEditProfileImg] = useState(null); // 프로필 미리보기 이미지
    const [isSecondCourseEmpty, setIsSecondCourseEmpty] = useState(true);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(true);
    const [matchPasswordStatus, setMatchPasswordStatus] = useState(true) // 비밀번호 일치 상황

    // form data    
    const [name, setName] = useState('');
    const [isStaff, setIsStaff] = useState(false);
    const [birthdate, setBirthdate] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [profileImgpath, setProfileImgpath] = useState('');
    const [profileContent, setProfileContent] = useState('');
    const [profileLink, setProfileLink] = useState('');
    const [profileCourseStatus, setProfileCourseStatus] = useState('');

    const [firstCourseName, setFirstCourseName] = useState('');
    const [firstCampusName, setFirstCampusName] = useState('');
    const [secondCourseName, setSecondCourseName] = useState('');
    const [secondCampusName, setSecondCampusName] = useState('');
    // 처음 second campus name 상태
    const [courseApplicationStatus, setCourseApplicationStatus] = useState('');
    const [campusList, setCampusList] = useState([])
    const [courseList, setCourseList] = useState({ first: [], second: [] })

    const inputStyle = "mt-1 px-3 py-2 text-gray-400 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sesac-sub focus:ring-sesac-sub block rounded-md sm:text-sm focus:ring-1"
    const inputReadOnlyStyle = "mt-1 px-3 py-2 bg-gray-100 border shadow-sm border-slate-300 text-gray-900 placeholder-slate-400 focus:outline-none focus:border-sesac-sub focus:ring-sesac-sub block w-full rounded-md sm:text-sm focus:ring-1 cursor-not-allowed"
    const inputNotMatchStyle = "mt-1 px-3 py-2 text-gray-400 bg-white border-2 shadow-sm border-red-300 placeholder-slate-400 focus:outline-none focus:border-red-300 focus:ring-red-300 block rounded-md sm:text-sm focus:ring-1"

    // url
    useEffect(() => {
        setIsPasswordEmpty(password == '')
        if (password == '') {
            setConfirmPassword('');
            setMatchPasswordStatus(true)
        }
        setMatchPasswordStatus(password === confirmPassword);
    }, [password + confirmPassword])

    useEffect(() => {
        setSecondCourseName('');
    }, [secondCampusName])

    useEffect(() => {
        setIsSecondCourseEmpty(((secondCampusName != null) && (secondCourseName == '')) && (profileCourseStatus));
    }, [secondCourseName])


    // 프로필 데이터 가져오기
    useEffect(() => {
        axios.get(`/profile/${username}/edit/`)
            .then(
                response => {
                    const data = response.data;
                    console.log(data)
                    setName(data.profile.name)
                    setIsStaff(data.profile.is_staff)
                    setBirthdate(data.profile.birthdate)
                    setPhoneNumber(data.profile.phone_number)
                    setEmail(data.profile.email)

                    setProfileImgpath(data.profile.profile_img_path)
                    setEditProfileImg(SERVER + data.profile.profile_img_path)
                    setProfileContent(data.profile.profile_content)
                    setProfileLink(data.profile.profile_link)
                    setProfileCourseStatus(data.profile.profile_course_status)

                    setFirstCourseName(data.profile.first_course__name)
                    setFirstCampusName(data.profile.first_course__campus__name)
                    setSecondCourseName(data.profile.second_course__name)
                    setSecondCampusName(data.profile.second_course__campus__name)

                    setCourseApplicationStatus(data.profile.second_course__name == "")
                    console.log(data.profile.profile_course_status)

                    setCampusList(data.campus);
                }
            )
            .catch(
                error => console.error(error)
            )
    }, []);


    // functions
    const requestCoursesByCampus = (selectName, campusId) => { /* 캠퍼스에 해당하는 과정 가져오기 */
        axios.get(`/profile/${username}/edit/?campus_id=${campusId}`)
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
            <select
                className={`w-[20%] ${inputStyle}`}
                name={selectName + 'Campus'}
                onChange={(e) => {
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

    const changeImagePreview = (e) => { /* 업로드 한 이미지 미리보기 처리 */
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const imageUrl = e.target.result;
                setEditProfileImg(imageUrl);
            };

            reader.readAsDataURL(file);
        }
    };

    const edit = async (event) => { /* 수정 요청 */
        event.preventDefault();

        if ((!matchPasswordStatus) | isSecondCourseEmpty) {
            return
        } else {
            let hashedPw = '';
            password === '' ? hashedPw = hashedPw : hashedPw = CryptoJS.SHA256(password).toString();

            const formData = new FormData();

            const data = {
                'birthdate': birthdate,
                'phone_number': phoneNumber,
                'password': hashedPw,
                'second_course': secondCourseName,
                'course_status': profileCourseStatus,
                'img_path': profileImgpath,
                'content': profileContent,
                'link': profileLink,
            }
            Object.entries(data).forEach(([key, value]) => {
                if (!(value == '' || value == null || value == '/media/profile/default_profile.png')) {
                    formData.append(key, value);
                }
            });

            // userFormData.append("birthdate", birthdate);
            // userFormData.append("phone_number", phoneNumber);
            // userFormData.append("password", hashedPw);
            // userFormData.append("second_course", secondCourseName);

            // profileFormData.append("img_path", profileImgpath);
            // profileFormData.append("content", profileContent);
            // profileFormData.append("link", profileLink);

            axios.put(`/profile/${username}/edit/`, formData, {
                headers: {
                    'Content-Type': "multipart/form-data",
                    'Authorization': session_key
                }
            })
                .then(response => {
                    console.log(response.data);
                    navigate(`/profile/${username}`);
                })
                .catch(error => {
                    console.log(error.response.data);
                });
        }
    };


    return (
        <>
            <div className="profile_edit_container flex justify-center pb-16">
                <form
                    className="flex flex-col gap-5 w-2/6"
                    onSubmit={edit}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            edit(e);
                        }
                    }
                    }
                >
                    {/* 프로필 사진 */}
                    {
                        isStaff ? null :
                            (
                                <section class="flex flex-col gap-5">
                                    <div className="flex justify-between items-center h-fit">
                                        <div className='w-[25%] rounded-full overflow-hidden border border-solid border-gray-200'>
                                            <div className="block w-full h-full p-2" to={`/profile/${username}`}>
                                                <img src={editProfileImg} alt='프로필 이미지' />
                                            </div>
                                        </div>
                                        <div className="w-[70%] flex flex-col gap-2">
                                            <h2 className="inline-block text-black-300 font-bold text-xl ml-2">{name}</h2>
                                            <label class="block">
                                                <span class="sr-only">프로필 사진 선택</span>
                                                <input
                                                    type="file"
                                                    class="block w-full text-sm text-slate-500
                                            file:cursor-pointer
                                            file:mr-7 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-sesac-sub file:text-sesac-green
                                            hover:file:bg-green-200"
                                                    onChange={
                                                        (e) => {
                                                            setProfileImgpath(e.target.files[0]);
                                                            changeImagePreview(e);
                                                        }
                                                    }
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </section>
                            )
                    }
                    <div className="flex flex-col gap-4 mt-1">
                        {/* 아이디 */}
                        <div className="flex flex-col gap-1 text-sm">
                            <div className="font-bold text-sesac-green">아이디</div>
                            <input
                                type="text"
                                name="content"
                                className={`${inputReadOnlyStyle}`}
                                placeholder={`${username}`}
                                disabled readonly
                            />
                        </div>
                        {/* 이메일 */}
                        <div className="flex flex-col gap-1 text-sm">
                            <div className="font-bold text-sesac-green">이메일</div>
                            <input
                                type="text"
                                name="content"
                                className={`${inputReadOnlyStyle}`}
                                placeholder={`${email}`}
                                disabled readonly
                            />
                        </div>
                        {/* 비밀번호 */}
                        <div className="flex flex-col gap-1 text-sm">
                            <div className="font-bold text-sesac-green">비밀번호</div>
                            <input
                                type="password"
                                name="password"
                                pattern="^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$"
                                title="영문, 숫자, 특수문자를 포함한 8~20자의 비밀번호를 입력해주세요."
                                className={`w-full ${inputStyle}`}
                                placeholder="변경할 비밀번호를 입력해주세요!"
                                onChange={(e) => {
                                    setPassword((e.target.value).trim());
                                }
                                }
                            />
                        </div>
                        {/* 비밀번호 확인 */}
                        <div className="flex flex-col gap-1 text-sm">
                            <div className="flex gap-2 items-end">
                                <span className="font-bold text-sesac-green">비밀번호 확인</span>
                                {
                                    !matchPasswordStatus ?
                                        (<span className="font-medium text-xs text-rose-600">비밀번호가 일치하지 않습니다.</span>) : null
                                }
                            </div>
                            <input
                                type="password"
                                name="confirm_password"
                                className={
                                    `${isPasswordEmpty ? (inputReadOnlyStyle) :
                                        matchPasswordStatus ? (`w-full ${inputStyle}`) : (`w-full ${inputNotMatchStyle}`)}`
                                }
                                placeholder="비밀번호를 한 번 더 입력해주세요!"
                                onChange={
                                    (e) => {
                                        setConfirmPassword((e.target.value).trim());
                                    }
                                }
                                value={confirmPassword}
                                readOnly={isPasswordEmpty ? true : false}
                                disable={isPasswordEmpty ? true : false}
                            />
                        </div>
                        {/* 한줄소개 */}
                        <div className="flex flex-col gap-1 text-sm">
                            <div className="font-bold text-sesac-green">한줄소개 ({contentLength}/20)</div>
                            <input
                                type="text"
                                name="content"
                                className={`w-full ${inputStyle}`}
                                placeholder={`${profileContent == undefined ? '한 줄로 나를 표현해보세요!' : profileContent}`}
                                maxLength={20}
                                onChange={(e) => {
                                    setContentLength(e.target.value.length);
                                    setProfileContent((e.target.value).trim());
                                }
                                }
                            />
                        </div>
                        {/* 링크 */}
                        <div className="text-sm">
                            <div className="font-bold text-sesac-green">링크</div>
                            <input
                                type="url"
                                name="link"
                                className={`w-full ${inputStyle}`}
                                placeholder={`${profileLink == undefined ? '나를 표현할 수 있는 링크를 연결해보세요!' : profileLink}`}
                                onChange={(e) => setProfileLink((e.target.value).trim())}
                            />
                        </div>
                        {/* 생년월일 */}
                        <div className="text-sm">
                            <div className="font-bold text-sesac-green">생년월일</div>
                            <input
                                type="date"
                                name="birthdate"
                                className={`w-full ${inputStyle}`}
                                value={`${birthdate}`}
                                onChange={(e) => setBirthdate(e.target.value)}
                            />
                        </div>
                        {/* 연락처 */}
                        <div className="text-sm">
                            <div className="font-bold text-sesac-green">전화번호</div>
                            <input
                                type="tel"
                                pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
                                name="phone_number"
                                className={`w-full ${inputStyle}`}
                                placeholder={`${phoneNumber}`}
                                onChange={(e) => setPhoneNumber((e.target.value).trim())}
                            />
                        </div>
                        {/* 과정 */}
                        <div className="text-sm">
                            <div className="font-bold text-sesac-green">캠퍼스 1</div>
                            <input
                                type="text"
                                name="first_course_name"
                                className={`w-full ${inputReadOnlyStyle}`}
                                placeholder={`${firstCampusName} 캠퍼스, ${firstCourseName}`}
                                disabled readonly
                            />
                        </div>
                        <div className="text-sm">
                            <div className="font-bold text-sesac-green">캠퍼스 2</div>
                            {profileCourseStatus ? (courseApplicationStatus ? (
                                <div className="flex gap-3">
                                    {generateCampusSelectAndOptionsElements('second')}
                                    <select
                                        className={`w-[80%] ${inputStyle}`}
                                        name="second_course__name"
                                        // value={secondCampusName}
                                        onChange={(e) => {
                                            setSecondCourseName(e.target.value);
                                        }}
                                    >
                                        <CourseOptions courseList={courseList.second} />
                                    </select>
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    name="second_course_name"
                                    class={`w-full ${inputReadOnlyStyle}`}
                                    placeholder={`${secondCampusName} 캠퍼스, ${secondCourseName}`}
                                />
                            )) : (
                                <input
                                    type="text"
                                    name="course_status"
                                    className={`w-full ${inputReadOnlyStyle}`}
                                    placeholder={`과정 승인을 기다리는 중입니다.`}
                                    disabled readonly
                                />
                            )

                            }
                        </div>
                    </div>
                    <div className="flex mt-5 justify-end gap-2">
                        <button class="cursor-pointer px-6 py-2 font-semibold text-sm bg-sesac-sub text-white rounded-full shadow-sm" onClick={
                            (e) => {
                                e.preventDefault();
                                navigate(`/profile/${username}`);
                            }
                        }>취소하기</button>
                        <input
                            type="submit"
                            className={`${!matchPasswordStatus | isSecondCourseEmpty ?
                                'cursor-not-allowed px-6 py-2 font-semibold text-sm bg-gray-400 text-white rounded-full shadow-sm' :
                                "cursor-pointer px-6 py-2 font-semibold text-sm bg-sesac-green text-white rounded-full shadow-sm"}`}
                            value="수정하기"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    edit(e);
                                }
                            }
                            }
                            disable={`${!matchPasswordStatus | isSecondCourseEmpty ? true : false}`}
                        />
                    </div>
                </form>
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