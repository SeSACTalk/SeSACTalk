import axios from "axios";
import React, { useState, useEffect } from "react";

import { getCookie } from "../../modules/handle_cookie";

import { PostDetail } from "../common/post/Posts";

/* global variables */
const SERVER = process.env.REACT_APP_BACK_BASE_URL;
const SERVER_NOTIFY_REPORT = `${SERVER}/admin/notify/report/`;
const session_key = getCookie('session_key');

const NotifyReport = function () {
  /* variables */
  const [reportList, setReportList] = useState([]);  
  const report_type_obj = {
    post : '게시물',
    reply : '댓글',
  }

  /* functions */
  useEffect(() => { /* 포스트 목록 바운딩 시 가져오기 */
    const getPosts = async () => {
          try {
            const response = await axios({
              method: "get",
              url: SERVER_NOTIFY_REPORT,
            });
            console.log(response.data)
            if (typeof response.data.message === 'undefined' ){
                setReportList(response.data);
            }
          } catch (error) {
            console.log(error.response.data);
          }
        }
    getPosts();
  }, []);

  return (
    <div className="Reports">
      <hr style={{'margin' : '10px'}}/>
      <div className="report_content" style={{'margin' : '20px 0'}}>
        {
          (reportList.length == undefined | reportList.length == 0) ? <p>신고 없음</p> :
          reportList.map((report, i) => (
                <div key = {i} style={{ 'margin' : '0 auto', 'width' : '70%' }}>
                  <Report report = {report} content_type = {report_type_obj[report.content_type]} />
                  {
                    ( reportList.length == (i+1) ) ? null : <hr/>
                  }
                </div>
              )
            )
        }
      </div>
      <hr style={{'margin' : '10px'}}/>
    </div>
  );
};

const Report =  function ({ report, content_type }) {
  /* variables */
  const [reportDetailClickStatus, setReportDetailClickStatus] = useState(false)
  /*
    <properties>
    id, date, content_type, category, content_id, reported_id, reported_name, reported_username, reporter_id, reporter_name, reporter_username, post_id, reported_content
    <요구사항>
    `${report_type_obj[content_type]}신고` , 날짜, reported_content
  */
  return (
    <>
      <div className="PostDetail" style={{ 'margin' : '10px auto', 'width' : '100%', 'border' : '1px solid blue', }}>
      {/* 1. 게시물 영역 */}
      <div style={{'padding' : '5px', 'margin' : '10px auto',}} onClick={()=>{
            setReportDetailClickStatus(!reportDetailClickStatus);
          }}>
        <p>
          <span>{ content_type } 신고 </span>
          &nbsp;|&nbsp;
          <span style={{'color': 'red'}}>{report.date}</span>
          &nbsp;|&nbsp;
          <span style={{'color': 'gray'}}> { report.reported_content }</span>
        </p>
      </div>
      <div style={{ 'width' : '100%', 'margin' : '10px auto',}}>
        {    
          /* report detail 영역 */
          reportDetailClickStatus ? <ReportDetail report = {report} content_type = {content_type}/> : null
        }
      </div>
    </div>
    </>
  )
}

const ReportDetail =  function ({ report, content_type }) {
  /* variables */
  const SERVER_REPORT_CONTENT =`${SERVER}/admin/report/${report.content_type}/${report.reported_id}/${report.reporter_id}/`
  // content의 유형이 post이든 reply든 post detail로 연결됨
  const SERVER_POST_POST = `${SERVER}/post/${report.reported_username}/${report.post_id}/`

  const [postDetailClickStatus, setPostDetailClickStatus] = useState(false)
  const [post, setPost] = useState(null)
  const [imgPath, setImgPath] = useState('')
  const [reportStatus, setReportStatus] = useState('')

  
  useEffect(() => {
    if (imgPath.length != 0 & post != null){
      setPostDetailClickStatus(!postDetailClickStatus);
    }    
    switch(report.report_status){
      case 0:
        setReportStatus('처리되지 않은 신고 ')
        break;
      case 20:
        setReportStatus('보류처리 된 신고 ')
        break;
    }
  }, [post, imgPath, reportStatus]); 

  /* functions */
    // 신고 처리하기
    const handlingReport = async (report_status) => {
          try {
            const response = await axios({
              method: "post",
              url: SERVER_REPORT_CONTENT,
              headers: { 
                'Authorization': `${session_key}`
              },
              data : {
                'id' : report.id,
                'report_status' : report_status,
              },
            });
            console.log(response.data);
            window.location.reload();
          } catch (error) {
            console.log(error.response.data);
          }
        }

    // post detail 가져오기: 이미 값이 있으면 요청을 더 하지 않음
    const getPostDetail = async () => {
      if (imgPath.length == 0 & post == null){
          try {
          const response = await axios({
            method: "get",
            url: SERVER_POST_POST,
            params: {
              request_post: 'True'
            },
          });
          const response_data = response.data
          setPost(response_data)
          setImgPath(`${SERVER}${response_data.img_path}`)
        } catch (error) {
          console.log(error.response.data);
        }
      } else {
        setPostDetailClickStatus(!postDetailClickStatus);
      }
    }
  /*
    <요구사항>
    신고자, 게시글(댓글) 링크, 신고 분류, 날짜
    const PostDetail = function ({post, img_path
  */
  return (
    <>
      <div className="ReportDetail" style={{ 'margin' : '10px auto', 'width' : '100%', 'border' : '1px solid blue' }}>
        <div style={{'padding' : '5px'}}>
            <p>
              <span style={{'fontWeight' : 800, 'color' : 'red'}}>
              {
                reportStatus
              }
              </span>
              &nbsp;|&nbsp;
              <span style={{'fontWeight' : 800, 'cursor' : 'pointer'}} onClick={()=>{
                getPostDetail();
              }}>{content_type} 디테일</span>
            </p>
            <br/>
            <p><span style={{'fontWeight' : 800}}>신고자</span> { report.reporter_name }({ report.reporter_username })</p>
            <p><span style={{'fontWeight' : 800}}>피신고자</span> { report.reported_name }({ report.reported_username })</p>
            <p><span style={{'fontWeight' : 800}}>신고 분류</span> { report.category }</p>
            <p><span style={{'fontWeight' : 800}}>신고 날짜</span> { report.date }</p>
        </div>
        <div style={{'padding' : '5px'}}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>{
            handlingReport(10);
          }}>신고 처리하기</button>
          &nbsp;|&nbsp;
          { /* 보류한 적 있으면, 버튼을 보이지 않음 */
            report.report_status == 20 ? null :
            <>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>{
                handlingReport(20);
              }}>신고 보류하기</button><span>&nbsp;|&nbsp;</span>
            </>
          }
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>{
            handlingReport(30);
          }}>신고 거부하기</button>
        </div>
        {    
          /* Report Content Detail 영역 */
          postDetailClickStatus ? <PostDetail post = {post} img_path = {imgPath}/> : null
        }
    </div>
    </>
  )
}

export default NotifyReport;