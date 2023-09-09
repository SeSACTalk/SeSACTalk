import { configureStore, createSlice } from '@reduxjs/toolkit'
import user from './store/userSlice'
import { writeModal, optionModal, reportModal, detailModal, postEditModal } from './store/modalSlice'

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
        postEditModal: postEditModal.reducer
    }
}) 