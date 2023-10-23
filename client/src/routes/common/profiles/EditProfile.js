import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { getCookie } from "../../../modules/handle_cookie";

import React from 'react';
import CryptoJS from 'crypto-js'

const SERVER = process.env.REACT_APP_BACK_BASE_URL
const session_key = getCookie('session_key')

const EditProfile = function () {
    const navigate = useNavigate();
    const { username } = useParams();

    const splitStr = "%"

    // response profile data
    const [profile, setProfile] = useState({});
    const [campusList, setCampusList] = useState({})
    const [courseList, setCourseList] = useState({ first: [], second: [] })

    // request profile (edit)data
    const [editUser, setEditUser] = useState({});
    const [editProfile, setEditProfile] = useState({});

    // etc(validate ...)
    const [thumbnail, setThumbnail] = useState();
    const [contentLength, setContentLength] = useState(0);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [matchPasswordStatus, setMatchPasswordStatus] = useState(true)
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(true);
    const [secondCampusId, setSecondCampusId] = useState('');
    const [secondCourseId, setSecondCourseId] = useState('');
    const [isSecondCourseEmpty, setIsSecondCourseEmpty] = useState(true);

    // css styles
    const inputStyle = "mt-1 px-3 py-2 text-gray-400 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sesac-sub focus:ring-sesac-sub block rounded-md sm:text-sm focus:ring-1"
    const inputReadOnlyStyle = "mt-1 px-3 py-2 bg-gray-100 border shadow-sm border-slate-300 text-gray-900 placeholder-slate-400 focus:outline-none focus:border-sesac-sub focus:ring-sesac-sub block w-full rounded-md sm:text-sm focus:ring-1 cursor-not-allowed"
    const inputNotMatchStyle = "mt-1 px-3 py-2 text-gray-400 bg-white border-2 shadow-sm border-red-300 placeholder-slate-400 focus:outline-none focus:border-red-300 focus:ring-red-300 block rounded-md sm:text-sm focus:ring-1"

    // useEffect
    useEffect(() => {
        axios.get(`/profile/${username}/edit/`)
            .then(
                response => {
                    let data = response.data

                    setProfile(data.profile);
                    setThumbnail((SERVER + data.profile.response_img_path));
                    setCampusList(data.campus);
                }
            )
            .catch(
                error => {
                    console.error(error.message);
                }

            )
    }, [username])

    useEffect(() => {
        switch (password) {
            case '':
                setConfirmPassword('');
                setIsPasswordEmpty(true);
                setMatchPasswordStatus(true);
                return
            default:
                setIsPasswordEmpty(false);
                setMatchPasswordStatus(password == confirmPassword);
                break;
        }
    }, [password + confirmPassword])

    useEffect(() => {
        let condition = false;
        if (secondCampusId == '') {
            condition = false;
            setIsSecondCourseEmpty(false);
        } else if (secondCampusId != '' && secondCourseId == '') {
            condition = true;
        }
        setIsSecondCourseEmpty(condition);
    }, [secondCampusId + secondCourseId])

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
                    setSecondCourseId('');
                    if (editProfile['second_course'] != undefined) {
                        delete editProfile.second_course
                    }

                    switch (selectedCampusId) {
                        case '':
                            setCourseList(prevCourseList => ({
                                ...prevCourseList,
                                [selectName]: []
                            }));
                            break;
                        default:
                            requestCoursesByCampus(selectName, selectedCampusId);
                            setSecondCampusId(selectedCampusId);
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

    const PreviewThumbnail = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const imageUrl = e.target.result;
                setThumbnail(imageUrl);
            };

            reader.readAsDataURL(file);
        }
    }

    let setCopyData = (key, value) => {
        let objType = key.split(splitStr)[0]
        let objKey = key.split(splitStr)[1]

        let copyData = null
        let setFunction = null

        switch (objType) {
            case 'user':
                copyData = editUser
                setFunction = setEditUser
                break;
            case 'profile':
                copyData = editProfile
                setFunction = setEditProfile
                break;
        }

        let copy = { ...copyData }

        if (!((value == '') && (value == 0))) {
            switch (objKey) {
                case 'password':
                    copy[objKey] = CryptoJS.SHA256(value).toString();
                    break;
                case 'second_course':
                    copy['course_status'] = false;
                default:
                    copy[objKey] = value;
                    break;
            }
        }

        setFunction(copy);
    }

    const appendFormData = (formObj, data) => {
        Object.entries(data).forEach(([key, value]) => {
            formObj.append(key, value);
        });
    }

    const edit = async (event, validatedCondition) => { /* 수정 요청 */
        event.preventDefault();

        if (validatedCondition) {
            const formData = new FormData();
            appendFormData(formData, editUser);
            appendFormData(formData, editProfile);

            axios.put(`/profile/${username}/edit/`, formData, {
                headers: {
                    'Content-Type': "multipart/form-data",
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
                    onSubmit={(e) => {
                        edit(e, (matchPasswordStatus && !isSecondCourseEmpty));
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            edit(e);
                        }
                    }
                    }
                >
                    {/* 프로필 사진 */}
                    {
                        profile.is_staff ? null :
                            (
                                <section class="flex flex-col gap-5">
                                    <div className="flex justify-between items-center h-fit">
                                        <div className='w-[25%] rounded-full overflow-hidden border border-solid border-gray-200'>
                                            <div className="block w-full h-full p-2" to={`/profile/${profile.username}`}>
                                                <img src={thumbnail} alt='프로필 이미지' />
                                            </div>
                                        </div>
                                        <div className="w-[70%] flex flex-col gap-2">
                                            <h2 className="inline-block text-black-300 font-bold text-xl ml-2">{profile.name}</h2>
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
                                                            setCopyData(`profile${splitStr}img_path`, e.target.files[0]);
                                                            PreviewThumbnail(e);
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
                                placeholder={`${profile.username}`}
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
                                placeholder={`${profile.email}`}
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
                                    setCopyData(`user${splitStr}password`, (e.target.value).trim());
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
                                readOnly={(isPasswordEmpty) ? true : false}
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
                                placeholder={`${profile.content == undefined ? '한 줄로 나를 표현해보세요!' : profile.content}`}
                                maxLength={20}
                                onChange={(e) => {
                                    setContentLength(e.target.value.length);
                                    setCopyData(`profile${splitStr}content`, (e.target.value).trim())
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
                                placeholder={`${profile.link == undefined ? '나를 표현할 수 있는 링크를 연결해보세요!' : profile.link}`}
                                onChange={
                                    (e) =>
                                        setCopyData(`profile${splitStr}link`, (e.target.value).trim())
                                }
                            />
                        </div>
                        {/* 생년월일 */}
                        <div className="text-sm">
                            <div className="font-bold text-sesac-green">생년월일</div>
                            <input
                                type="date"
                                name="birthdate"
                                className={`w-full ${inputStyle}`}
                                value={`${profile.birthdate}`}
                                onChange={(e) => {
                                    let copy = profile
                                    copy.birthdate = e.target.value;
                                    setProfile(copy);
                                    setCopyData(`user${splitStr}birthdate`, e.target.value);
                                }
                                }
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
                                placeholder={`${profile.phone_number}`}
                                onChange={(e) =>
                                    setCopyData(`user${splitStr}phone_number`, (e.target.value).trim())}
                            />
                        </div>
                        {/* 과정 */}
                        <div className="text-sm">
                            <div className="font-bold text-sesac-green">캠퍼스 1</div>
                            <input
                                type="text"
                                name="first_course_name"
                                className={`w-full ${inputReadOnlyStyle}`}
                                placeholder={`${profile.first_campus_name} 캠퍼스, ${profile.first_course_name}`}
                                disabled readonly
                            />
                        </div>
                        <div className="text-sm">
                            <div className="font-bold text-sesac-green">캠퍼스 2</div>
                            {
                                profile.response_course_status == 0 ? (<div className="flex gap-3">
                                    {generateCampusSelectAndOptionsElements('second')}
                                    <select
                                        className={`w-[80%] ${inputStyle}`}
                                        name="second_course__name"
                                        onChange={(e) => {
                                            setSecondCourseId(e.target.value);
                                            setCopyData(`profile${splitStr}second_course`, e.target.value);
                                        }}
                                    >
                                        <CourseOptions courseList={courseList.second} />
                                    </select>
                                </div>
                                )
                                    : (
                                        profile.response_course_status == 10 ? (
                                            <input
                                                type="text"
                                                name="second_course_name"
                                                class={`w-full ${inputReadOnlyStyle}`}
                                                placeholder={`${profile.second_campus_name} 캠퍼스, ${profile.second_course_name}`}
                                            />
                                        ) :
                                            (
                                                <input
                                                    type="text"
                                                    name="course_status"
                                                    className={`w-full ${inputReadOnlyStyle}`}
                                                    placeholder={`과정 승인을 기다리는 중입니다.`}
                                                    disabled readonly
                                                />
                                            )
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
                                    edit(e, (matchPasswordStatus && !isSecondCourseEmpty));
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
            <option value="">선택</option>
            {courseList.map((course) => (
                <option key={course.id} value={course.id}>{course.name}</option>
            ))}
        </>
    );
}

export default EditProfile