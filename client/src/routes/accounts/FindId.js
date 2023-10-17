import { React, useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const FindId = function () {
    // States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [findIdModal, setFindIdModal] = useState(false);
    const [isWriting, setIsWriting] = useState(false);

    // DOM
    const submitButton = useRef(null);


    const findUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/accounts/find/user/id/', { name, email })
            setUsername(response.data.result[0].username);
        }
        catch (error) {

        }
        finally {
            setFindIdModal(!findIdModal);
        }
    }

    useEffect(() => {
        if (name.length === 0 || email.length === 0) {
            submitButton.current.setAttribute('disabled', 'disabled')
            setIsWriting(false)
        } else {
            setIsWriting(true)
            submitButton.current.removeAttribute('disabled')
        }
    }, [name, email])

    return (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <div className='w-1/3 border'>
                <div className='p-5'>
                    <div className='w-32 h-32 border-[3px] border-black rounded-full p-5 mx-auto mt-10'>
                        <img src={`${process.env.PUBLIC_URL}/img/lock.png`} />
                    </div>
                    <div className='text-center mt-4'>
                        <p className='text-xl font-bold'>로그인에 문제가 있나요?</p>
                        <span className='mt-5 leading-5 text-gray-700'>성함과 아이디를 입력하시면 아이디를 알려드립니다.</span>
                    </div>
                    <form className='mt-5'>
                        <input className='block w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm' type="text" name='username' placeholder='이름' value={name} onChange={(e) => setName(e.target.value)} />
                        <input className='block w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm mt-3' type="email" name='email' placeholder='이메일' value={email} onChange={(e) => setEmail(e.target.value)} />
                        <button className={`w-full h-10 text-white bg-sesac-sub2 rounded-lg text-sm mt-5 ${isWriting ? 'hover:bg-sesac-dark-green hover:transition-colors' : 'opacity-50 cursor-not-allowed'}`} type='button' ref={submitButton} onClick={findUser}>확인</button>
                    </form>
                    <span className='block mt-3 relative text-center before:content-[""] before:block before:w-1/3 before:h-[1px] before:border before:border-gray-300 before:absolute before:left-5 before:top-1/2 before:-translate-y-1/2 after:content-[""] after:block after:w-1/3 after:h-[1px] after:border after:border-gray-300 after:absolute after:right-5 after:top-1/2 after:-translate-y-1/2'>또는</span>
                    <div className='text-center mt-5 font-medium'>
                        <Link to='/account/signup'>새 계정 만들기</Link>
                    </div>
                </div>
                <div className='p-5 border-t bg-gray-50 text-center'>
                    <Link to='/account/login'>로그인으로 돌아가기</Link>
                </div>
            </div>
            {findIdModal && <FindIdModal findIdModal={findIdModal} setFindIdModal={setFindIdModal} username={username} />}
        </div>
    );
};

const FindIdModal = function ({ findIdModal, setFindIdModal, username }) {
    const modalPopup = useRef(null);

    /**
     * 검은배경 클릭시 모달창 닫기
     * @param {Event} e 
     */
    const closeModal = (e) => {
        if (modalPopup.current === e.target) {
            setFindIdModal(!findIdModal);
        }
    }
    if (username) {
        return (
            <div className="modal post_modal flex justify-center items-center absolute w-full h-screen z-50" ref={modalPopup}>
                <div className='flex flex-col justify-center items-center w-1/3 h-52 p-5 bg-zinc-50 rounded-xl text-red-500'>
                    <p>고객님의 정보와 일치하는 아이디입니다.
                    </p>
                    <p className='font-bold'>{username}</p>
                    <Link className='bg-sesac-green rounded-full p-2 mt-5 text-white' to="/account/login">로그인하러 가기</Link>
                </div>
            </div>
        )
    } else {
        return (
            <div className="modal post_modal flex justify-center items-center absolute w-full h-screen z-50" ref={modalPopup} onClick={closeModal}>
                <div className='flex flex-col justify-center items-center w-1/3 h-52 p-5 bg-zinc-50 rounded-xl text-red-500'>
                    <p>입력해주신 정보와 일치하는 계정이 없습니다.
                    </p>
                </div>
            </div>
        )
    }
}

export default FindId;