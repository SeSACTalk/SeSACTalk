import axios from 'axios';
import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js'
import { useNavigate } from 'react-router-dom'

const SERVER = process.env.REACT_APP_BACK_BASE_URL
const SERVER_ACCOUNTS_SIGNUP = SERVER + '/accounts/signup/'

const Signup = function () {
    {/* 
        TODO: 프론트 전달 사항
        - 프론트의 유효성 검사 필요 (first_course를 선택하지 않았는데, second_course만 한다던지..)
        - 아이디가 중복 검사 ajax 호출 함수 == checkId
        - 비밀번호가 비밀번호 확인과 다를 경우 경고 모달 노출은 프론트 영역이므로 처리 안 함
    */}

    {/* variables */ }
    let navigate = useNavigate()
    const [campusList, setCampusList] = useState([]);
    const [courseList, setCourseList] = useState({ first: [], second: [] });


    {/* form variables */ }
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [email, setEmail] = useState('');
    const [firstCourse, setFirstCourse] = useState('');
    const [secondCourse, setSecondCourse] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    {/* functions */ }
    useEffect(() => { /* 캠퍼스 목록 바운딩 시 가져오기 */
        axios.get(SERVER_ACCOUNTS_SIGNUP)
            .then(response => {
                setCampusList(response.data.campus);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const checkId = () => { /* 아이디 중복 체크 */
        const username = document.getElementById("username").value;
        axios.post((SERVER + 'accounts/check/id/'), {
            params: {
                username: username
            }
        })
            .then(response => {
                console.log(response.data);
                return true;
            })
            .catch(error => {
                console.error(error);
            });
    };


    const requestCoursesByCampus = (selectName, campusId) => { /* 캠퍼스에 해당하는 과정 가져오기 */
        axios.get(SERVER_ACCOUNTS_SIGNUP, {
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
    const signup = async (e) => { /* 회원가입 처리 */
        e.preventDefault();

        const hashedPw = CryptoJS.SHA256(password).toString();
        /* checkId() 아이디 중복 체크 */
        console.log(SERVER_ACCOUNTS_SIGNUP)
        const _ = await axios.post(SERVER_ACCOUNTS_SIGNUP, {

            name: name,
            gender: gender,
            birthdate: birthdate,
            phone_number: phonenumber,
            email: email,
            first_course: firstCourse,
            second_course: secondCourse,
            username: username,
            password: hashedPw,

        })
            .then(response => {
                console.log(response.data);
                navigate('accounts/login');
            })
            .catch(error => {
                console.log(error.response.data);
            });
    }

    return (
        <div>
            <form onSubmit={signup}>
                <tr>
                    {/* 이름 : 2-5글자 미만 한글 */}
                    <td colSpan={2}>이름</td>
                    <td colSpan={2}><input type="text" name='name' placeholder='이름을 입력하세요' value={name} onChange={(e) => setName(e.target.value)} /></td>
                </tr>
                <tr>
                    {/* 성별 : 남성/여성 */}
                    <td colSpan={2}>성별</td>
                    <td colSpan={2}>
                        <select name='gender' value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value=''>선택</option>
                            <option value='female'>여성</option>
                            <option value='male'>남성</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    {/* 생년월일 :  2000-01-01 형식 */}
                    <td colSpan={2}>생년월일</td>
                    <td colSpan={2}>
                        <input type='date' name='birthdate' value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
                    </td>
                </tr>
                <tr>
                    {/* 전화번호: xxx-xxxx-xxxx, 정규식 사용 */}
                    <td colSpan={2}>전화번호</td>
                    <td colSpan={2}><input type="text" name='phone_number' placeholder='전화번호를 입력하세요' value={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} /></td>
                </tr>
                <tr>
                    {/* 이메일: xxx@xxxx.com, 정규식 사용 */}
                    <td colSpan={2}>이메일</td>
                    <td colSpan={2}><input type="email" name='email' placeholder='이메일을 입력하세요' value={email} onChange={(e) => setEmail(e.target.value)} /></td>
                </tr>
                <tr>
                    {/* 캠퍼스1, 과정1 */}
                    <td>(필수)캠퍼스1</td>
                    <td>
                        {generateCampusSelectAndOptionsElements('first')}
                    </td>
                    <td>(필수)과정1</td>
                    <td>
                        <select name='firstCourse' value={firstCourse} onChange={(e) => setFirstCourse(e.target.value)}>
                            <CourseOptions courseList={courseList.first} />
                        </select>
                    </td>
                </tr>
                <tr>
                    {/* 캠퍼스2, 과정2 */}
                    <td>(선택)캠퍼스2</td>
                    <td>
                        {generateCampusSelectAndOptionsElements('second')}
                    </td>
                    <td>(선택)과정2</td>
                    <td>
                        <select name='secondCourse' value={secondCourse} onChange={(e) => setSecondCourse(e.target.value)}>
                            <CourseOptions courseList={courseList.second} />
                        </select>
                    </td>
                </tr>
                <tr>
                    {/* 아이디: 영문/숫자 포함 8~20자, 중복확인 */}
                    <td colSpan={2}>아이디</td>
                    <td colSpan={2}><input type="text" id="username" name='username' placeholder='아이디를 입력하세요' value={username} onChange={(e) => setUsername(e.target.value)} /></td>
                    {/* <td colSpan={2}><button onClick={()=>{checkId()}}>중복확인</button></td> */}
                </tr>
                <tr>
                    {/* 비밀번호: 영문/숫자/특수문자 포함 8~20자 - 이중 암호화(SHA-256) */}
                    <td colSpan={2}>비밀번호</td>
                    <td colSpan={2}><input type="password" name='password' placeholder='비밀번호를 입력하세요' value={password} onChange={(e) => setPassword(e.target.value)} /></td>
                </tr>
                {/* <tr> : TODO: front
                    비밀번호 확인: 입력한 비밀번호와 일치여부 
                    <td colSpan={2}>비밀번호 확인</td>
                    <td colSpan={2}><input type="password" name='confirm_password' placeholder='비밀번호를 재입력하세요'/></td>
                </tr>   */}
                <input type='submit' value="회원가입" />
            </form>
        </div>
    );
};

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

export default Signup;