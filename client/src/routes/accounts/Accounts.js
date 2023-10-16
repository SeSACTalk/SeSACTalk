import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from "react-redux";

function Accounts() {
    let role = useSelector((state) => state.role);

    useEffect(() => {
        if (role === 'USER') {
            window.location.href = '/'
        } else if (role === 'STAFF') {
            window.location.href = '/admin'
        }
    }, []);

    return (
        <div className="Accounts">
            <Outlet></Outlet>
        </div>
    )
}

export default Accounts;