/* eslint-disable */
import React, {useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getCookie } from '../../modules/handle_cookie'
import { checkAuthMiddleware, checkInfoMiddleware } from '../../middleware/middleware';


function General() {
    let navigate = useNavigate();
    useEffect(() => {
        checkAuthMiddleware()
            .then(() => {
                checkInfoMiddleware()
                .then(()=>{
                    navigate('/admin')
                })
                .catch(()=>{
                    navigate('/general')
                })
            })
            .catch(() => {
                navigate('/accounts/login');   
            });
        }
        , []);
    let username = getCookie('username')
    return (
        <div>
            <span className="Main">
                <Link to={'/'}>Main</Link>&nbsp;|&nbsp;
            </span>
            <span className="General">
                <Link to={`/post/${username}`}>Post</Link>&nbsp;|&nbsp;
            </span>
            <span className="Explore">
                <Link to={`/explore`}>Explore</Link>{/* nbsp;|&nbsp; */}
            </span>
        </div>
    );
}

export default General;