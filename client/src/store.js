import { configureStore, createSlice } from '@reduxjs/toolkit'
import { writeModal, optionModal, reportModal, postEditModal, verifyPasswordForEditProfileModal, verifyPasswordForWithdrawModal, ownFollowModal, ownFollowerModal, otherFollowModal, otherFollowerModal, profileSettingModal } from './store/modalSlice'

import role from './store/userSlice';
import detailPath from './store/postSlice';
import { minNav, exploreNav, noticeNav } from './store/navSlice';

let chatStatus = createSlice({
    name: 'chatStatus',
    initialState: false,
    reducers: {
        changeStatus(state, acition) {
            return !state
        }
    }
})

export let { changeStatus } = chatStatus.actions;

export default configureStore({
    reducer: {
        // user
        role: role.reducer,
        chatStatus: chatStatus.reducer,
        // post
        detailPath: detailPath.reducer,
        // modal
        writeModal: writeModal.reducer,
        optionModal: optionModal.reducer,
        reportModal: reportModal.reducer,
        postEditModal: postEditModal.reducer,
        // nav
        minNav: minNav.reducer,
        exploreNav: exploreNav.reducer,
        noticeNav: noticeNav.reducer,
        // devTools: false
        verifyPasswordForEditProfileModal : verifyPasswordForEditProfileModal.reducer,
        verifyPasswordForWithdrawModal : verifyPasswordForWithdrawModal.reducer,
        ownFollowModal : ownFollowModal.reducer,
        ownFollowerModal : ownFollowerModal.reducer,
        otherFollowModal : otherFollowModal.reducer,
        otherFollowerModal : otherFollowerModal.reducer,
        profileSettingModal : profileSettingModal.reducer,
    }
}) 
