import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SERVER = process.env.REACT_APP_BACK_BASE_URL;

const Explore = function() {
    /* variables */
    const [exploreContent, setExploreContent] = useState('');
    const [exploreUsersResult, setExploreUsersResult] = useState('');
    const [exploreTagsResult, setExploreTagsResult] = useState('');

    
    const getExploreUsersResult = async (inputData) => {
        const SERVER_USERS_EXPLORE = `${SERVER}/explore/users/${inputData}/`
        try {
                const response = await axios({
                method: "post",
                url: SERVER_USERS_EXPLORE,
            });
            setExploreUsersResult(response.data);
        } catch (error) {
            console.log(error.response.data);
        }
    }
    
    const getExploreTagsResult = async (inputData) => {
        const SERVER_TAGS_EXPLORE = `${SERVER}/explore/tags/${inputData.split('#')[1]}/`
        try {
            const response = await axios({
                method: "post",
                url: SERVER_TAGS_EXPLORE,
            });
            setExploreTagsResult(response.data);
        } catch (error) {
            console.log(error.response.data);
        }
    }
        
    /* functions */
    // 검색어 변화할 때
    useEffect(() => { 
        const removeSpacesExploreContent = exploreContent.replace(/\s/g, '');
        switch(removeSpacesExploreContent.charAt(0)){ //char의 인덱스 0번째가 #으로 시작할 경우
            case "":
                setExploreUsersResult('');
                setExploreUsersResult('');
                break;
            case "#":
                if (removeSpacesExploreContent.split('#')[1].length != 0){
                    getExploreTagsResult(removeSpacesExploreContent);
                }
                break;
            default :
                getExploreUsersResult(removeSpacesExploreContent);
                break;
        }
    }, [exploreContent]);

    return (
        <div className='Explore' style={{'width' : '50%', 'margin' : '50px auto', 'border' : '1px solid black'}}>
            <div className="explore_content" style={{'width' : '90%', 'margin' : '20px auto', 'padding' : '3px', 'border' : '1px solid black'}}>
                <div className="explore_input" style={{'width' : '90%', 'margin' : '20px auto', 'padding' : '3px', 'border' : '1px solid black'}}>
                    <input type="text"  style={{'width' : '100%',}} onChange={
                        (e) => setExploreContent(e.target.value.trim())
                    }/>
                </div>
                <div className="explore_result" style={{'width' : '90%', 'margin' : '20px auto', 'padding' : '3px', 'border' : '1px solid black'}}>
                    <div style={{ margin: '0 auto', width: '90%' }}>
                        {   exploreContent.trim().length == 0 ? <p>검색어를 입력하세요(유저 아이디 / 해시태그 검색)</p> :
                                (
                                    (exploreUsersResult.length === 0 && exploreTagsResult.length === 0) ? (
                                        <p>검색 결과 없음</p>
                                    ) : (
                                        exploreUsersResult.length > 0 ? (
                                        exploreUsersResult.map((er, i) => (
                                            <ExploreUser
                                            key={i}
                                            results={ er }
                                            isLast = {exploreUsersResult.length === (i + 1)}
                                            />
                                        ))
                                        ) : (
                                        exploreTagsResult.map((er, i) => (
                                            <ExploreTag
                                            key={i}
                                            results={ er }
                                            isLast = {exploreTagsResult.length === (i + 1)}
                                            />
                                        ))
                                        )
                                    )
                                )
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

const ExploreUser = function({results, isLast}) {
    let navigate = useNavigate()

    /* variables */
    // 프로필이 완성되면 링크 변경해주세요!
    const CLIENT_PROFILE = `/profile/${results.username}`
    const profile_img_path = `${SERVER}${results.profile_img_path}`

    return (
        <>
        <div style={{'display' : 'flex', 'cursor' : 'pointer'}} onClick={()=>{
            navigate(CLIENT_PROFILE);
        }}>
            <div>
                {/* 프로필 영역 */}
                <img src={profile_img_path}/>
            </div>
            <div style={{'margin' : '4px 80px', 'padding' : '3px 10px'}} >
                <div style={{'display' : 'block'}}>
                    {/* 이름 영역 */}
                    {results.name}
                </div>
                <div style={{'display' : 'block'}}>
                    {/* 아이디, 캠퍼스 영역 */}
                    <span>{results.username}</span>&nbsp;|&nbsp;
                    <span style={{'color' : 'green'}}>{results.campus_name} 캠퍼스</span>
                </div>
            </div>
        </div>
        { isLast ? null : <hr />}
        </>
    )
}
const ExploreTag = function({results, isLast}) {
    /* variables */
    let navigate = useNavigate()

    const hashtag_name = results.hashtag_name;
    const hashtag_id = results.hashtag_id;
    const post_ids = results.post_ids; //list
    const count_post = results.count_post;


    return (
        <>
        <div style={{'display' : 'flex', 'cursor' : 'pointer'}} onClick={()=>{
            // navigate(CLIENT_PROFILE);
        }}>
            <div style={{'backgroundColor' : '#D9D9D9', 'width' : '70px', 'height' : '70px', 'borderRadius' : '50%'
            , 'fontSize' : '50px', 'color' : 'gray', 'fontWeight' : 900}}>#</div>
            <div style={{'margin' : '4px 80px', 'padding' : '3px 10px'}}>
                {/* 해시태그 내용 영역 */}
                <div style={{'display' : 'block',}}>
                    {hashtag_name}
                </div>
                {/* 개수 영역 */}
                <div style={{'display' : 'block', 'color' : 'green'}}>
                    <span></span>
                    <span>{count_post}개&nbsp;게시물</span>
                </div>
            </div>
        </div>
        { isLast ? null : <hr />}
        </>
    )
}
export default Explore