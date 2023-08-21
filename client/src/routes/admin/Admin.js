/* eslint-disable */
import React, {useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getCookie } from '../../modules/handle_cookie'
import { checkAuthMiddleware, checkInfoMiddleware } from '../../middleware/middleware';


function Admin() {
    let navigate = useNavigate();
    useEffect(() => {
        checkAuthMiddleware()
            .then(() => {
                checkInfoMiddleware()
                .then(()=>{
                    navigate('/admin')
                })
                .catch(()=>{
                    navigate('/')
                })
            })
            .catch(() => {
                navigate('/accounts/login');   
            });
        }, []);

    let username = getCookie('username')
    return (
        <div className="Common">
            <Link to={`/post/${username}`}>Post</Link>{/* &nbsp;|&nbsp; */}
        </div>
    );
}

export default Admin;