import React from "react";
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';

const Admin = function () {
    return (
        <div className="container">
            <Link to='/admin/auth/user'>권한</Link>
            <Outlet></Outlet>
        </div>
    )
}

export default Admin