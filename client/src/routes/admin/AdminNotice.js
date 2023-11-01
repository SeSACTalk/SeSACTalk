import React, { useEffect, useState } from 'react'
import { getCookie } from "../../modules/handleCookie";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'

import { setDetailPath } from "../../store/postSlice";

/* Cookies */
let username = getCookie('username')

const AdminNotice = function () {
    let navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    let page = searchParams.get('page');

    /* States */
    const [isNotice, setIsNotice] = useState(true);

    useEffect(() => {
        setIsNotice(!(page === 'report'));
    }, [page])

    return (
        <div className="admin_notification w-4/5 p-10">
            <div className="flex justify-between p-3">
                <div className="flex gap-3">
                    <select
                        className="border border-black h-6"
                        defaultValue=''
                        onChange={(e) => {
                            navigate(`?page=${e.target.value}`)
                        }}>
                        <option value='notify' selected={(isNotice)}>알림</option>
                        <option value='report' selected={!(isNotice)}>신고 알림</option>
                    </select>
                </div>
            </div>
            {
                isNotice ? <Notification /> : <Report />
            }
        </div>
    )
}

function Notification() {

    //states
    const [readNotificationDataResult, setReadNotificationDataResult] = useState([]);
    const [notReadNotificationDataResult, setNotReadNotificationDataResult] = useState([]);

    // 알림 불러오기
    useEffect(() => {
        axios.get(`/user/${username}/notify/`)
            .then(
                response => {
                    // response data set
                    let copy = { ...response.data };
                    setNotReadNotificationDataResult([...copy.notRead])
                    setReadNotificationDataResult([...copy.read])
                    // get요청 뒤 read_date update
                    if (readNotificationDataResult.length !== 0) {
                        axios.put(`/user/${username}/notify/`)
                            .then(
                                response => {
                                    console.log('읽음 처리')
                                }
                            )
                            .catch(
                                error => console.error(error)
                            )
                    }
                }
            )
            .catch(
                error => console.error(error)
            )
    }, [readNotificationDataResult.length])

    return (
        <table className="admin_notification_notification w-full mt-5 text-sm text-center text-gray-500">
            <thead>
                <tr className="border-b">
                    <th scope="col" className="px-6 py-3">알림 시간</th>
                    <th scope="col" className="px-6 py-3">읽음 여부</th>
                    <th scope="col" className="px-6 py-3">회원 이름</th>
                    <th scope="col" className="px-6 py-3">컨텐츠 유형</th>
                    <th scope="col" className="px-6 py-3">컨텐츠 이동</th>
                </tr>
            </thead>
            <tbody>
                {
                    (notReadNotificationDataResult && readNotificationDataResult) ? (
                        (notReadNotificationDataResult.length === 0 && readNotificationDataResult.length === 0) ? (
                            <tr className="border-b">
                                <td className="col-span-5 text-center text-gray-500">도착한 알림이 없어요.</td>
                            </tr>
                        ) : null
                    ) : null
                }

                {
                    notReadNotificationDataResult && notReadNotificationDataResult.length !== 0 ? (
                        <>
                            {notReadNotificationDataResult.map((element, i) => (
                                <NotificationTd element={element} readStatus={'읽지 않음'} key={i} />
                            ))}
                        </>
                    ) : null
                }
                {
                    readNotificationDataResult && readNotificationDataResult.length !== 0 ? (
                        <>
                            {readNotificationDataResult.map((element, i) => (
                                <NotificationTd element={element} readStatus={'읽음'} key={i} />
                            ))}
                        </>
                    ) : null
                }
            </tbody>
        </table>
    )
}

function NotificationTd({ element, readStatus }) {
    let dispatch = useDispatch();

    /**
     * 신고유형에 따른 분류
     * @param {String} type 
     * @returns 
     */
    let getNotificationType = (type) => {
        switch (type) {
            case 'reply':
                return '댓글'
            case 'like':
                return '좋아요'
            case 'follow':
                return '팔로우'
            case 'report':
                return '신고'
            default:
                return;
        }
    }
    return (
        <tr className="border-b">
            <td className="px-6 py-4">
                {element.occur_date}
                {element.occur_date !== undefined ? (!(element.occur_date.includes("년")) ? " 전" : "") : ""}
            </td>
            <td className="px-6 py-4">{readStatus}</td>
            <td className="px-6 py-4">{element.targeting_user_name}</td>
            <td className="px-6 py-4">{getNotificationType(element.type)}</td>
            <td className="px-6 py-4">{
                (!(element.type === 'follow')) ?
                    (
                        <Link
                            to={element.uri}
                            onClick={
                                () => {
                                    dispatch(setDetailPath(`${element.targeted_user_username}/${element.post_id}`))
                                }
                            }
                        > 이동하기
                        </Link>
                    ) : (
                        <Link
                            to={element.uri}
                        > 이동하기
                        </Link>
                    )
            }</td>
        </tr>
    )
}

function Report() {
    let dispatch = useDispatch();

    /* States */
    const [reportDataResult, setReportDataResult] = useState([]);
    const [reportUpdateStatus, setReportUpdateStatus] = useState(false);

    useEffect(() => {
        getReport();
        return () => {
            setReportDataResult([]);
        }
    }, [reportUpdateStatus])

    let getReport = () => {
        axios.get('/admin/notify/report/')
            .then(
                response => {
                    // response data set
                    let copy = [...response.data];
                    setReportDataResult(copy);
                }
            )
            .catch(
                error => console.error(error)
            )
    }

    return (
        <table className="admin_notification_report w-full mt-5 text-sm text-center text-gray-500">
            <thead>
                <tr className="border-b">
                    <th scope="col" className="px-4 py-3">신고 일시</th>
                    <th scope="col" className="px-4 py-3">컨텐츠 유형</th>
                    <th scope="col" className="px-4 py-3">신고 유형</th>
                    <th scope="col" className="px-4 py-3">신고자</th>
                    <th scope="col" className="px-4 py-3">피신고자</th>
                    <th scope="col" className="px-4 py-3">컨텐츠 이동</th>
                    <th scope="col" className="px-4 py-3">상태</th>
                </tr>
            </thead>
            <tbody>
                {
                    reportDataResult && reportDataResult.length === 0 ? (
                        <tr className="border-b">
                            <td className="col-span-5 text-center text-gray-500">도착한 알림이 없어요.</td>
                        </tr>
                    ) : null
                }
                {
                    reportDataResult.map((element, i) => {
                        return (
                            <tr className="border-b" key={i}>
                                <td className="px-4 py-4">{element.date}</td>
                                <td className="px-4 py-4">{element.ko_content_type}</td>
                                <td className="px-4 py-4">{element.category}</td>
                                <td className="px-4 py-4">
                                    <Link
                                        to={`/profile/${element.reporter_username}`}
                                    > {`${element.reporter_username} : ${element.reporter_name}`}
                                    </Link>
                                </td>
                                <td className="px-4 py-4">
                                    <Link
                                        to={`/profile/${element.reported_username}`}
                                    > {`${element.reported_username} : ${element.reported_name}`}
                                    </Link>
                                </td>
                                <td className="px-4 py-4">
                                    <Link
                                        to={element.uri}
                                        onClick={
                                            () => {
                                                dispatch(setDetailPath(`${element.username}/${element.post_id}`))
                                            }
                                        }
                                    > 이동하기
                                    </Link>
                                </td>
                                <td className="px-4 py-4">
                                    {/* 신고 처리  */}
                                    <ReportOption report={element} setReportUpdateStatus={setReportUpdateStatus} key={i} />
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}

function ReportOption({ report, setReportUpdateStatus }) {
    /**
     * 신고 처리 함수
     * @param {Event} e 
     * @param {String} content_type 
     * @param {String} reported_id 
     * @param {String} reporter_id 
     * @returns 
     */
    const processReport = async (e, content_type, reported_id, reporter_id) => {
        e.preventDefault();
        var report_status = e.target.value
        if (report_status !== '') {
            report_status = Number(report_status);
            try {
                await axios.put(`/admin/report/${content_type}/${reported_id}/${reporter_id}/`, {
                    id: e.target.dataset.id,
                    report_status: report_status,
                });
                setReportUpdateStatus((prevReportUpdateStatus) => !prevReportUpdateStatus);
            }
            catch (error) {
                console.error(error)
            }
        } else {
            return
        }
    }

    return (
        report.report_status === 0 ? (
            <select
                defaultValue=""
                data-id={report.id}
                onChange={
                    (e) => {
                        processReport(e, report.content_type, report.reported, report.reporter)
                    }
                }>
                <option value="">선택(신규)</option>
                <option value="10">승인</option>
                <option value="20">보류</option>
                <option value="30">거절</option>
            </select>
        ) : (
            report.report_status === 20 ?
                (
                    <select
                        defaultValue=""
                        data-id={report.id}
                        onChange={
                            (e) => {
                                processReport(e, report.content_type, report.reported, report.reporter)
                            }
                        }>
                        <option value="">선택(보류)</option>
                        <option value="10">승인</option>
                        <option value="30">거절</option>
                    </select>
                )
                : null
        )
    )
}

export default AdminNotice;