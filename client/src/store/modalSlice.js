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

let verifyPasswordModal = createSlice({
    name: 'verifyPasswordModal',
    initialState: false,
    reducers: {
        changeVerifyPasswordModal(state, action) {
            return !state
        }
    }
})

let followModal = createSlice({
    name: 'followModal',
    initialState: false,
    reducers: {
        changeFollowModal(state, action) {
            return !state
        }
    }
})

let followerModal = createSlice({
    name: 'followerModal',
    initialState: false,
    reducers: {
        changeFollowerModal(state, action) {
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

export { writeModal, optionModal, reportModal, detailModal, verifyPasswordModal, followModal, followerModal, profileSettingModal };

export let { changeWirteModal } = writeModal.actions;
export let { changeOptionModal } = optionModal.actions;
export let { changeReportModal } = reportModal.actions;
export let { changeDetailModal } = detailModal.actions;
export let { changeVerifyPasswordModal } = verifyPasswordModal.actions;
export let { changeFollowModal } = followModal.actions;
export let { changeFollowerModal } = followerModal.actions;
export let { changeProfileSettingModal } = profileSettingModal.actions;