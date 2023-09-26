import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

/* components */
import ChatList from '../chat/ChatList'
import WritePost from '../post/WritePost';

const Chat = function () {
    let writeModal = useSelector((state) => state.writeModal)

    return (
        <div className="chat flex w-full">
            <ChatList />
            <Outlet></Outlet>
            {/* Modals */}
            {writeModal && <WritePost />}
        </div>
    )

}

export default Chat;