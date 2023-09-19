import { configureStore, createSlice } from '@reduxjs/toolkit'

import user from './store/userSlice'
import { writeModal, optionModal, reportModal, detailModal, postEditModal } from './store/modalSlice'
import { exploreNav } from './store/navSlice'

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
        user: user.reducer,
        chatStatus: chatStatus.reducer,
        // modal
        writeModal: writeModal.reducer,
        optionModal: optionModal.reducer,
        reportModal: reportModal.reducer,
        detailModal: detailModal.reducer,
        postEditModal: postEditModal.reducer,
        // nav
        exploreNav: exploreNav.reducer
    }
}) 
