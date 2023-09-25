import { configureStore, createSlice } from '@reduxjs/toolkit'

import user from './store/userSlice'
import detailPath from './store/postSlice'
import { writeModal, optionModal, reportModal, postEditModal } from './store/modalSlice'
import { minNav, exploreNav, noticeNav } from './store/navSlice'

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
        user: user.reducer,
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
        noticeNav: noticeNav.reducer
    }
}) 
