import { configureStore, createSlice } from '@reduxjs/toolkit'
import user from './store/userSlice'
import { writeModal, optionModal, reportModal, detailModal, verifyPasswordForEditProfileModal, verifyPasswordForWithdrawModal, ownFollowModal, ownFollowerModal, otherFollowModal, otherFollowerModal, profileSettingModal } from './store/modalSlice'

let server = createSlice({
    name: 'server',
    initialState: process.env.REACT_APP_BACK_BASE_URL,
    reducers: {

    }
})

export default configureStore({
    reducer: {
        user: user.reducer,
        server: server.reducer,
        writeModal: writeModal.reducer,
        optionModal: optionModal.reducer,
        reportModal: reportModal.reducer,
        detailModal: detailModal.reducer,
        verifyPasswordForEditProfileModal : verifyPasswordForEditProfileModal.reducer,
        verifyPasswordForWithdrawModal : verifyPasswordForWithdrawModal.reducer,
        ownFollowModal : ownFollowModal.reducer,
        ownFollowerModal : ownFollowerModal.reducer,
        otherFollowModal : otherFollowModal.reducer,
        otherFollowerModal : otherFollowerModal.reducer,
        profileSettingModal : profileSettingModal.reducer,
    }
}) 