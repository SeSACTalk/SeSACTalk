import React, { useEffect, useState } from "react";

/* components */
import ChatNavbar from '../chat/ChatNavbar'
import ChatList from '../chat/ChatList'
import { Outlet } from "react-router-dom";

const Chat = function () {

    return (
        <div className="chat flex">
            <ChatNavbar />
            <ChatList />
            <Outlet></Outlet>
        </div>
    )

}

export default Chat;