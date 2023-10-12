import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { changeProfileSettingModal } from "../../../store/modalSlice";

import { getCookie, deleteCookie } from "../../../modules/handle_cookie";

const SERVER = process.env.REACT_APP_BACK_BASE_URL;
let session_key = getCookie('session_key');

function WithdrawModal() {
    /* etc */
    const { username } = useParams();
    const navigate = useNavigate();

    /* DOM */
    const modalPopup = useRef()
    let dispatch = useDispatch();
    let profileSettingModal = useSelector((state) => state.profileSettingModal);

    /* states */
    const [scroll, setScroll] = useState();
    const [userInfoForWithdrawStatus, setUserInfoForWithdrawStatus] = useState(true);
    const [withdrawalConfirmationStatus, setWithdrawalConfirmationStatus] = useState(false);
    const [withdrawalCompleteStatus, setWithdrawalCompleteStatus] = useState(false);

    /* SERVER */
    const SERVER_WITHDRAW = `${SERVER}/accounts/${username}/withdraw/`

    /* useEffect */
    useEffect(() => {
        setScroll(window.scrollY)
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';

        }
    }, [scroll])

    /* functions */
    const closeProfileSettingModal = () => { // profileSettingModal상태가 true면 닫기
        if (profileSettingModal) {
            dispatch(changeProfileSettingModal(profileSettingModal));
        }
    }

    const cancelWithdrawal = () => { // 회원 탈퇴 취소(모달창 닫기)
        closeProfileSettingModal();
        navigate(`/profile/${username}`);
    }

    const closeModal = (e) => { // 모달창 닫기
        if (modalPopup.current === e.target) {
            cancelWithdrawal();
        }
    }

    return (
        <div className="modal withdraw_modal flex justify-center items-center absolute left-0 w-full h-screen" style={{ top: scroll }} ref={modalPopup} onClick={closeModal}>
            <div className="detail_container flex gap-2 justify-center rounded-lg w-3/12 h-[39%] p-5 bg-zinc-50">
                <div className="w-5/6">
                    <div className="flex flex-col gap-1 h-[88%] justify-between items-center text-sm">
                        <span className="text-gray-500 text-base font-semibold">회원 탈퇴</span>
                        {userInfoForWithdrawStatus && <UserInfoForWithdrawModal SERVER_WITHDRAW={SERVER_WITHDRAW} setUserInfoForWithdrawStatus={setUserInfoForWithdrawStatus} setWithdrawalConfirmationStatus={setWithdrawalConfirmationStatus} />}
                        {withdrawalConfirmationStatus && <WithdrawalConfirmationModal SERVER_WITHDRAW={SERVER_WITHDRAW} setWithdrawalConfirmationStatus={setWithdrawalConfirmationStatus} setWithdrawalCompleteStatus={setWithdrawalCompleteStatus} cancelWithdrawal={cancelWithdrawal} />}
                        {withdrawalCompleteStatus && <WithdrawalCompleteModal setWithdrawalCompleteStatus={setWithdrawalCompleteStatus} closeProfileSettingModal={closeProfileSettingModal} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

function UserInfoForWithdrawModal({ SERVER_WITHDRAW, setUserInfoForWithdrawStatus, setWithdrawalConfirmationStatus }) {
    /* states */
    const [user, setUser] = useState({});

    // user 정보 get
    useEffect(() => {
        axios.get(SERVER_WITHDRAW, {
            headers: {
                'Authorization': session_key
            }
        }).then((response) => {
            let copy = { ...response.data }
            setUser(copy)
        }).catch((error) => {
            console.error(error)
        })
    }, [])

    // function 


    return (
        <>
            <div className="w-4/5 p-2 flex justify-evenly overflow-auto relative mx-auto bg-sesac-sub-transparency dark:bg-slate-800 dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl">
                <div className='logo_wrap w-14 h-14 rounded-full overflow-hidden border border-solid border-gray-200'>
                    <span className="block w-full h-full p-2">
                        <img src={SERVER + user.profile_img_path} alt={user.username} />
                    </span>
                </div>
                <div className="flex flex-col gap-2 justify-center">
                    <span className="text-sesac-green font-semibold">{user.username}</span>
                </div>
            </div>
            <button className="w-8/12 px-4 py-2 font-semibold text-sm bg-sesac-green text-white rounded-full shadow-lg" type="button" onClick={
                (e) => {
                    setUserInfoForWithdrawStatus(false);
                    setWithdrawalConfirmationStatus(true);
                }
            }>이 계정을 영구 삭제합니다.</button>
        </>
    )
}

function WithdrawalConfirmationModal({ SERVER_WITHDRAW, setWithdrawalConfirmationStatus, setWithdrawalCompleteStatus, cancelWithdrawal }) {
    /* SERVER */
    const SERVER_ACCOUNTS_LOGOUT = `${SERVER}/accounts/logout/`

    const navigate = useNavigate();
    const { username } = useParams();

    {/* functions */ }
    const handleWithdraw = async (e) => { // 회원 탈퇴
        e.preventDefault();
        await axios.delete(SERVER_WITHDRAW, {
            headers: {
                'Authorization': session_key
            },
        })
            .then(response => {
                console.log(response.data);
                console.log('회원 탈퇴 완료');
                handleLogout(e);
            })
            .catch(error => {
                // 잘못된 접근
                console.log(error.response.data);
            });
    }

    // 로그아웃
    const handleLogout = async (e) => {
        e.preventDefault();
        await axios.delete('/accounts/logout/')
        .then(
            response =>  {
                deleteCookie('session_key');
                deleteCookie('username');
                navigate('/accounts/login');
            }
        )
        .catch(
            error =>  {
                console.log(error.response.data);
            }
        )
    }
    // 로그인 페이지로 이동 : navigate('/accounts/login');

    return (
        <>
            <div className="w-full p-2 flex flex-col justify-evenly">
                <p>계정을 삭제하면 프로필, 사진, 댓글, 좋아요, 팔로워가 영구적으로 삭제됩니다.</p>
                <p>계정을 정말 삭제하시겠습니까?</p>
            </div>
            <div className="flex w-9/12 justify-between">
                <button className="w-auto px-6 py-2 font-semibold text-sm bg-white text-slate-500 rounded-full shadow-lg" type="button" onClick={
                    () => {
                        cancelWithdrawal();
                    }
                }>취소</button>
                <button className="w-auto px-6 py-2 font-semibold text-sm bg-sesac-green text-white rounded-full shadow-lg" type="button" onClick={
                    (e) => {
                        handleWithdraw(e);
                        setWithdrawalConfirmationStatus(false);
                        setWithdrawalCompleteStatus(true);
                    }
                }>확인</button>
            </div>
        </>
    )

}
function WithdrawalCompleteModal({ setWithdrawalCompleteStatus, closeProfileSettingModal }) {
    // 회원 탈퇴 == 아이디, 이메일을 제외한 모든 
    const navigate = useNavigate();
    return (
        <>
            <div className="w-full p-2 text-center">
                계정 삭제가 완료되었습니다.
            </div>
            <button className="w-auto px-6 py-2 font-semibold text-sm bg-sesac-green text-white rounded-full shadow-lg" type="button" onClick={
                (e) => {
                    closeProfileSettingModal(e);
                    navigate('/accounts/login');
                }
            }>확인</button>
        </>
    )

}

export default WithdrawModal;