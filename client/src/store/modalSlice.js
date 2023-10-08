import { createSlice } from '@reduxjs/toolkit'

let writeModal = createSlice({
    name: 'wirteModal',
    initialState: false,
    reducers: {
        changeWirteModal(state, action) {
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

let detailModal = createSlice({
    name: 'detailModal',
    initialState: false,
    reducers: {
        changeDetailModal(state, action) {
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
export { writeModal, optionModal, reportModal, detailModal, verifyPasswordForEditProfileModal, verifyPasswordForWithdrawModal, ownFollowModal, ownFollowerModal, otherFollowModal, otherFollowerModal, profileSettingModal };

export let { changeWirteModal } = writeModal.actions;
export let { changeOptionModal } = optionModal.actions;
export let { changeReportModal } = reportModal.actions;
export let { changeDetailModal } = detailModal.actions;
export let { changeVerifyPasswordForEditProfileModal } = verifyPasswordForEditProfileModal.actions;
export let { changeVerifyPasswordForWithdrawModal } = verifyPasswordForWithdrawModal.actions;
export let { changeOwnFollowModal } = ownFollowModal.actions;
export let { changeOwnFollowerModal } = ownFollowerModal.actions;
export let { changeOtherFollowModal } = otherFollowModal.actions;
export let { changeOtherFollowerModal } = otherFollowerModal.actions;
export let { changeProfileSettingModal } = profileSettingModal.actions;