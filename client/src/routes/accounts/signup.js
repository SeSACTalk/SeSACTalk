import axios from 'axios';
import CryptoJS from 'crypto-js'
import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {BACK_BASE_URL} from '../../global_variables'

const SignUp = function () {
    {/* 
    프론트 전달 사항
        - 프론트의 유효성 검사 필요 
        - 아이디가 중복 검사 ajax 작성 완료 -> 경고 모달 노출 필요
        - 비밀번호가 비밀번호 확인과 다를 경우 경고 모달 노출은 프론트 영역이므로 처리 안 함
    */}
    function checkId(){

    }
    return (
        <div>
            <form action = {(BACK_BASE_URL)+"accounts/signup/"} method='post'>
                <table>
                    <tr>
                        {/* 이름 : 5글자 미만 한글 */}
                        <td colSpan={2}>이름</td>
                        <td colSpan={2}><input type="text" name='name' placeholder='이름을 입력하세요'/></td>
                    </tr>
                    <tr>
                        {/* 성별 : 남성/여성 */}
                        <td colSpan={2}>성별</td>
                        <td colSpan={2}>
                            <select name='gender'>
                                <option value=''>선택</option>
                                <option value='female'>여성</option>
                                <option value='male'>남성</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        {/* 전화번호: xxx-xxxx-xxxx, 정규식 사용 */}
                        <td colSpan={2}>전화번호</td>
                        <td colSpan={2}><input type="text" name='phone_number' placeholder='전화번호를 입력하세요'/></td>
                    </tr>
                    <tr>
                        {/* 이메일: xxx@xxxx.com, 정규식 사용 */}
                        <td colSpan={2}>이메일</td>
                        <td colSpan={2}><input type="email" name='email' placeholder='이메일을 입력하세요'/></td>
                    </tr>
                    <tr>
                        {/* 캠퍼스1, 과정1 */}
                        <td>캠퍼스1</td>
                        <td>
                            <select name='first_campus'>
                                <option value=''>선택</option>
                                <option value='female'>여성</option>
                                <option value='male'>남성</option>
                            </select>
                        </td>
                        <td>과정1</td>
                        <td>
                            <select name='first_course'>
                                <option value=''>선택</option>
                                <option value='female'>여성</option>
                                <option value='male'>남성</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        {/* 캠퍼스2, 과정2 */}
                        <td>캠퍼스2</td>
                        <td>
                            <select name='second_campus'>
                                <option value=''>선택</option>
                                <option value=''></option>
                            </select>
                        </td>
                        <td>과정2</td>
                        <td>
                            <select name='second_course'>
                                <option value=''>선택</option>
                                <option value=''></option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        {/* 아이디: 영문/숫자 포함 8~20자, 중복확인 */}
                        <td>아이디</td>
                        <td><input type="text" name='username' placeholder='아이디를 입력하세요'/></td>
                        <td colSpan={2}><button type='button' onClick={checkId()}>중복 확인</button></td>
                    </tr>
                    <tr>
                        {/* 비밀번호: 영문/숫자/특수문자 포함 8~20자 - 이중 암호화(SHA-256) */}
                        <td colSpan={2}>비밀번호</td>
                        <td colSpan={2}><input type="password" name='password' placeholder='비밀번호를 입력하세요'/></td>
                    </tr>
                    <tr>
                        {/* 비밀번호 확인: 입력한 비밀번호와 일치여부 */}
                        <td colSpan={2}>비밀번호 확인</td>
                        <td colSpan={2}><input type="password" name='confirm_password' placeholder='비밀번호를 재입력하세요'/></td>
                    </tr>
                </table>
                <input type='submit' value="회원가입"/>
            </form>
        </div>
    )
}

export default SignUp