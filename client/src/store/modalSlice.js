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

let postEditModal = createSlice({
    name: 'postEditModal',
    initialState: false,
    reducers: {
        changePostEditModal(state, action) {
            return !state
        }
    }
})

export { writeModal, optionModal, reportModal, detailModal, postEditModal };

export let { changeWirteModal } = writeModal.actions;
export let { changeOptionModal } = optionModal.actions;
export let { changeReportModal } = reportModal.actions;
export let { changeDetailModal } = detailModal.actions;
export let { changePostEditModal } = postEditModal.actions;