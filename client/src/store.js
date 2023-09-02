import { configureStore, createSlice } from '@reduxjs/toolkit'
import user from './store/userSlice'

let server = createSlice({
    name: 'server',
    initialState: process.env.REACT_APP_BACK_BASE_URL,
    reducers: {

    }
})

export default configureStore({
    reducer: {
        user: user.reducer,
        server: server.reducer
    }
}) 