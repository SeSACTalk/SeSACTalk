import axios from 'axios';
import CryptoJS from 'crypto-js'
import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SignUp = function () {
    const navigate = useNavigate()

    // const [name, setName] = useState('');
    // const [gender, setGender] = useState('');
    // const [birthdate, setBirthdate] = useState('');
    // const [phone, setPhone] = useState('');
    // const [campus, setCampus] = useState('');
    // const [course, setCource] = useState('');
    // const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [ConfirmPw, setConfirmPw] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        const hashedPw = CryptoJS.SHA256(password).toString()

        if (ConfirmPw !== password) {
            console.log('비밀번호가 일치하지 않습니다')
        } else {
            try {
                const response = await axios.post('http://127.0.0.1:8000/accounts/signup/', {  username, hashedPw })
                console.log(response.data)

            } catch (error) {
                console.error('SignUp failed')
            }
        }
    }

    return (
        <div className='container mx-auto w-9/12'>
            <form onSubmit={handleSignup}>
                {/* <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">성명</label>
                        <input type="text" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name='name' placeholder="김새싹" required value={name} onChange={(e) => setName(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">성별</label>
                        <select id="gender" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" defaultValue={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value={gender}>성별</option>
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="birthdate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">생년월일</label>
                        <input type="date" id="birthdate" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name='birthdate' required value={birthdate} onChange={(e) => setBirthdate(e.target.value)}></input>
                    </div>
                    <div >
                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">전화번호</label>
                        <input type="tel" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="010-1234-5678" required value={phone} onChange={(e) => { setPhone(e.target.value) }}></input>
                    </div>
                    <div>
                        <label htmlFor="campus" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">캠퍼스</label>
                        <select id="campus" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" defaultValue={campus} onChange={(e) => { setCampus(e.target.value) }}>
                            <option value={campus}>캠퍼스</option>
                            <option value='서대문 캠퍼스'>서대문 캠퍼스</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="cource" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">과정</label>
                        <select id="cource" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" defaultValue={course} onChange={(e) => { setCource(e.target.value) }}>
                            <option value={course}>과정</option>
                            <option value='서대문과정1'>서대문과정1</option>
                        </select>
                    </div>
                </div>
                <div className="mb-6">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">이메일</label>
                    <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="sesac@sesac.com" required value={email} onChange={(e) => { setEmail(e.target.value) }}></input>
                </div> */}
                <div className="mb-6">
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">아이디</label>
                    <input type="text" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required value={username} onChange={(e) => { setUsername(e.target.value) }}></input>
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">비밀번호</label>
                    <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <div className="mb-6">
                    <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">비밀번호 확인</label>
                    <input type="password" id="confirm_password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required value={ConfirmPw} onChange={(e) => setConfirmPw(e.currentTarget.value)}></input>
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">회원가입</button>
            </form>
        </div>
    )
}

export default SignUp