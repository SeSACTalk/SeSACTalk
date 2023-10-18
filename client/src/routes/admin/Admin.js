import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

function Admin() {
    let navigate = useNavigate();

    // States
    let role = useSelector((state) => state.role)

    useEffect(() => {
        if (role === 'STAFF') {
            return
        } else {
            navigate('/')
        }
    }, [])

    if (role === 'STAFF') {
        return (
            <Outlet />
        );
    }
}

export default Admin;