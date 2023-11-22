import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
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
    const [checkPassword, setCheckPassword] = useState('');

    const nameAlert = useRef();
    const genderAlert = useRef();
    const birthdateAlert = useRef();
    const phoneAlert = useRef();
    const emailAlert = useRef();
    const courseAlert = useRef();
    const idAlert = useRef();
    const checkpwAlert = useRef();
    const FirstPageValidator = () => {
        let validate=true

        if(!formatName(name)){
            nameAlert.current.innerHTML='이름을 한글 2-5글자로 입력해 주세요.'
            validate=false
        }
        if(!gender){
            genderAlert.current.innerHTML='성별을 선택해 주세요.'
            validate=false
        }
        if(!birthdate){
            birthdateAlert.current.innerHTML='생년월일을 입력해 주세요.'
            validate=false
        }
        if(phonenumber.length != 13){
            phoneAlert.current.innerHTML='전화번호를 올바른 형식으로 입력해 주세요.'
            validate=false
        }
        if(!firstCourse){
            courseAlert.current.innerHTML='캠퍼스와 과정을 선택해 주세요.'
            validate=false
        }
        
        return validate
    }
    const SecondPageValidator = () => {
        let validate=true
        // idAlert.current.innerHTML='이미 존재하는 아이디입니다.'

        if(!formatEmail(email)){
            emailAlert.current.innerHTML='이메일을 올바른 형식으로 입력해 주세요.'
            validate=false
        }
        if(!formatId(username)){
            idAlert.current.innerHTML='영문과 숫자를 포함하여 8-20자리를 입력해주세요.'
            validate=false
        }
        if(password !== checkPassword){
            checkpwAlert.current.innerHTML='비밀번호가 일치하지 않습니다.'
            validate=false
        }

        return validate

    }


    const resetRef = () =>{
        nameAlert.current.innerHTML=''
        
        genderAlert.current.innerHTML=''
        
        birthdateAlert.current.innerHTML=''
        
        phoneAlert.current.innerHTML=''
        
        courseAlert.current.innerHTML=''

        emailAlert.current.innerHTML=''

        idAlert.current.innerHTML=''

        checkpwAlert.current.innerHTML=''
    }
    

    {/* modal variable */}
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContents, setModalContents] =  useState('');
    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    

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

    function formatName(input){
        const regex = /^[가-힣]{2,5}$/;
        if (!regex.test(input)) {
            // 잘못된 입력
            return false
        }
        return true
    }

    function formatPhoneNumber(input) {
        const phoneNumber = input.replace(/-/g, "");
        const length = input.length
        if (phoneNumber.length <= 3) {
            input = phoneNumber
        } else if (phoneNumber.length <= 7) {
            input  = phoneNumber.substring(0, 3) + '-' + phoneNumber.substring(3);
        } else {
            input 
            = phoneNumber.substring(0, 3) + '-'
            + phoneNumber.substring(3, 7) + '-'
            + phoneNumber.substring(7);
        }
        return input;
    }

    function formatEmail(input) {      
        var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        if (!regExp.test(input)) {
            //정규식 검증 실패
            return false
        }
        return true
    };

    function formatId(input) {      
        var regExp = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;
        if (!regExp.test(input)) {
            // 잘못된 입력
            return false
        }
        return true
    };

    const checkId = async () => { /* 아이디 중복 체크 */
        const id = username;
        try{
            const response = await axios.post((SERVER + '/accounts/check/id/'), {
                username: id
            });
            const responseData = response.data;

            if (responseData && 'message' in responseData){  /* 아이디 사용 가능 */
                return true;
            }else if (responseData && 'error' in responseData) {  /* 아이디 중복 */
                return false;
            }
        }catch(error) {
            return false;
        }
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
            <select disabled={selectName==='second' ? (!firstCourse) : false} name={selectName + 'Campus'} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-1/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' onChange={(e) => {            
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
                {
                    selectName === 'first' ? (<option value=''>캠퍼스1</option>) : (<option value=''>캠퍼스2</option>)
                }
                
                {campusList.map((campus) => (
                    <option key={campus.id} value={campus.id}>{campus.name}</option>
                ))}
            </select>
        );
    };

    const handleNextPageBtnClick = (e) =>{
        e.preventDefault();
        resetRef();
        if(FirstPageValidator()){
            const first_page = document.getElementById('first_page');
            first_page.style.display='none';

            const second_page = document.getElementById('second_page');
            second_page.style.display='flex';
        }
        return;
    }
    const handlePrevPageBtnClick = (e) =>{
        e.preventDefault();
        resetRef();
        
        const first_page = document.getElementById('first_page');
        first_page.style.display='flex';

        const second_page = document.getElementById('second_page');
        second_page.style.display='none';

    }

    const signup = async (e) => { /* 회원가입 처리 */
        e.preventDefault();
        resetRef();
        if(SecondPageValidator()){
            const isIdAvailable = await checkId();
            if (isIdAvailable === true){            
                const hashedPw = CryptoJS.SHA256(password).toString();

                /* if(password === checkPassword) */
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
                        navigate('/accounts/login');
                    })
                    .catch(error => {
                        console.log(error.response.data.error);

                        if (error.response.data.error.includes('email')) {
                            setModalContents('이미 가입한 이메일입니다.')
                        }

                        openModal()
                        
                    });
            }else if(isIdAvailable === false){
                console.log("sign fail")
                setModalContents('이미 가입한 아이디입니다.')
                openModal()
            }else{
                setModalContents('오류가 발생했습니다. 잠시후 다시 시도해 주세요.')
                openModal()
            }
        }
    }

    return (
        <div className='w-screen h-screen flex flex-col items-center place-content-center'>
            <div className='w-2/5 p-[2rem] border-2'>
                <div className='flex items-center place-content-center mb-10'>
                    <div className='w-10'>
                        <img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt='새싹톡'/>
                    </div>
                    <div className='object-center font-bold'>
                        <span>SeSAC Talk Talk</span>
                    </div>
                </div>

                <form onSubmit={signup}>
                    <div id='first_page' className='flex flex-col gap-3'>
                        <div><input type="text" name='name' placeholder='이름' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={name} onChange={(e) => setName(e.target.value)} />
                        <span className='text-red-500 text-xs' ref={nameAlert}></span></div>
                        <div><select name='gender' value={gender} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' onChange={(e) => setGender(e.target.value)}>
                                <option value=''>성별</option>
                                <option value='female'>여성</option>
                                <option value='male'>남성</option>
                        </select>
                        <span className='text-red-500 text-xs' ref={genderAlert}></span></div>
                        <div><input type='date' name='birthdate' placeholder='생년월일' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
                        <span className='text-red-500 text-xs' ref={birthdateAlert}></span></div>
                        <div><input type="text" maxLength={13} name='phone_number' placeholder='전화번호' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={phonenumber} onChange={(e) => 
                            {
                                let format = formatPhoneNumber(e.target.value);
                                setPhonenumber(format);
                            }
                            } />
                            <span className='text-red-500 text-xs' ref={phoneAlert}></span></div>
                        <div>
                            {generateCampusSelectAndOptionsElements('first')}
                            <select name='firstCourse' value={firstCourse} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-2/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' onChange={(e) => setFirstCourse(e.target.value)}>
                                <CourseOptions courseList={courseList.first} selectName='first'/>
                            </select>
                            <span className='text-red-500 text-xs' ref={courseAlert}></span>
                        </div>
                        <div>
                            {generateCampusSelectAndOptionsElements('second')}
                            <select name='secondCourse' value={secondCourse} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-2/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' onChange={(e) => setSecondCourse(e.target.value)} disabled={!firstCourse}>
                                <CourseOptions courseList={courseList.second} selectName='second'/>
                            </select>
                        </div>
                        <div className='grid grid-cols-2 justify-items-center gap-1'>
                            <input type='button' disabled='true' className='text-white bg-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 m-1 w-full' value="이전" />
                            <input type='button' onClick={handleNextPageBtnClick} className='text-white bg-sesac-green hover:bg-sesac-dark-green focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 m-1 w-full dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800' value="다음" />
                        </div>
                    </div>

                    <div id='second_page' className='flex flex-col gap-3' style={{ display: 'none' }}>
                        <div><input type="email" name='email' placeholder='이메일' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={email} onChange={(e) => setEmail(e.target.value)} />
                        <span className='text-red-500 text-xs' ref={emailAlert}></span></div>

                        <div><input type="text" id="username" name='username' placeholder='아이디' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={username} onChange={(e) => setUsername(e.target.value)} />
                        <span className='text-red-500 text-xs' ref={idAlert}></span></div>
                        <div><input type="password" name='password' placeholder='비밀번호' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                        <div><input type="password" name='password' placeholder='비밀번호 확인' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={checkPassword} onChange={(e) => setCheckPassword(e.target.value)} />
                        <span className='text-red-500 text-xs' ref={checkpwAlert}></span></div>
                        <div className='grid grid-cols-2 justify-items-center gap-1'>
                            <input type='button' onClick={handlePrevPageBtnClick} className='text-white bg-sesac-green hover:bg-sesac-dark-green focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 m-1 w-full' value="이전" />
                            <input type='submit' disabled={username == '' || password == '' || checkPassword == '' || email == ''} className={`text-white ${ username == '' || password == '' || checkPassword == '' || email == '' ? 'bg-gray-400' : 'bg-sesac-green hover:bg-sesac-dark-green focus:ring-4'}  focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 m-1 w-full dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800`} value="회원가입" />
                        </div>
                    </div>
                    
                    {/* <tr> : TODO: front
                        비밀번호 확인: 입력한 비밀번호와 일치여부 
                        <td colSpan={2}>비밀번호 확인</td>
                        <td colSpan={2}><input type="password" name='confirm_password' placeholder='비밀번호를 재입력하세요'/></td>
                    </tr>   */}
                </form>
            </div>
            {isModalOpen && (
                <div className="modal fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
                    <div className="modal-container bg-white w-1/2 p-4 rounded shadow-lg">
                        <div className="flex justify-end">
                            <button className="text-gray-500" onClick={closeModal}>&times;</button>
                        </div>
                        <div className='grid grid-rows place-items-center gap-2'>
                            
                            <i className="fa fa-exclamation-triangle mt-5" aria-hidden="true" style={{ color: 'orange', fontSize: '100px' }}></i>
                            <h3 className="text-2xl font-bold">회원가입에 실패했습니다.</h3>
                            <p className='mb-5'>{modalContents}</p>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
        
    );
};

function CourseOptions({ courseList, selectName }) {
    return (
        <>
            {
                selectName === 'first' ? (<option value=''>과정1</option>) : (<option value=''>과정2</option>)
            }
            {courseList.map((course) => (
                <option key={course.id} value={course.id}>{course.name}</option>
            ))}
        </>
    );
}

export default Signup;