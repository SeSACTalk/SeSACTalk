import React from 'react';
import { Outlet } from 'react-router-dom';

function Accounts() {
    return (
        <div className="Accounts">
            <Outlet></Outlet>
        </div>
    );
}

export default Accounts;