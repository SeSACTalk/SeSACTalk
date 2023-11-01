import React from "react";
import { Outlet } from "react-router-dom";

/* Components */
import ChatList from '../chat/ChatList';

const Chat = function () {
    return (
        <div className="chat flex w-full">
            <ChatList />
            <Outlet></Outlet>
        </div>
    )
}

export default Chat;