import { createSlice } from '@reduxjs/toolkit'

let writeModal = createSlice({
    name: 'writeModal',
    initialState: false,
    reducers: {
        changeWriteModal(state, action) {
            return !state
        }
    }
})

let optionModal = createSlice({
    name: 'optionModal',
    initialState: false,
    reducers: {
        changeOptionModal(state, action) {
            return !state
        }
    }
})

let reportModal = createSlice({
    name: 'reportModal',
    initialState: false,
    reducers: {
        changeReportModal(state, action) {
            return !state
        }
    }
})

let postEditModal = createSlice({
    name: 'postEditModal',
    initialState: false,
    reducers: {
        changePostEditModal(state, action) {
            return !state
        }
    }
})

let verifyPasswordForEditProfileModal = createSlice({
    name: 'verifyPasswordForEditProfileModal',
    initialState: false,
    reducers: {
        changeVerifyPasswordForEditProfileModal(state, action) {
            return !state
        }
    }
})

let verifyPasswordForWithdrawModal = createSlice({
    name: 'verifyPasswordForWithdrawModal',
    initialState: false,
    reducers: {
        changeVerifyPasswordForWithdrawModal(state, action) {
            return !state
        }
    }
})

let ownFollowModal = createSlice({
    name: 'ownFollowModal',
    initialState: false,
    reducers: {
        changeOwnFollowModal(state, action) {
            return !state
        }
    }
})

let ownFollowerModal = createSlice({
    name: 'ownFollowerModal',
    initialState: false,
    reducers: {
        changeOwnFollowerModal(state, action) {
            return !state
        }
    }
})

let otherFollowModal = createSlice({
    name: 'otherFollowModal',
    initialState: false,
    reducers: {
        changeOtherFollowModal(state, action) {
            return !state
        }
    }
})

let otherFollowerModal = createSlice({
    name: 'otherFollowerModal',
    initialState: false,
    reducers: {
        changeOtherFollowerModal(state, action) {
            return !state
        }
    }
})

let profileSettingModal = createSlice({
    name: 'profileSettingModal',
    initialState: false,
    reducers: {
        changeProfileSettingModal(state, action) {
            return !state
        }
    }
})
export { writeModal, optionModal, reportModal, postEditModal, verifyPasswordForEditProfileModal, verifyPasswordForWithdrawModal, ownFollowModal, ownFollowerModal, otherFollowModal, otherFollowerModal, profileSettingModal };

export let { changeWriteModal } = writeModal.actions;
export let { changeOptionModal } = optionModal.actions;
export let { changeReportModal } = reportModal.actions;
export let { changePostEditModal } = postEditModal.actions;
export let { changeVerifyPasswordForEditProfileModal } = verifyPasswordForEditProfileModal.actions;
export let { changeVerifyPasswordForWithdrawModal } = verifyPasswordForWithdrawModal.actions;
export let { changeOwnFollowModal } = ownFollowModal.actions;
export let { changeOwnFollowerModal } = ownFollowerModal.actions;
export let { changeOtherFollowModal } = otherFollowModal.actions;
export let { changeOtherFollowerModal } = otherFollowerModal.actions;
export let { changeProfileSettingModal } = profileSettingModal.actions;
