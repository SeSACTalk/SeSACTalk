import { configureStore, createSlice } from '@reduxjs/toolkit'
import { session_key, user } from './store/userSlice.js'

let server = createSlice({
    name: 'server',
    initialState: process.env.REACT_APP_BACK_BASE_URL,
    reducers: {

    }
})

export default configureStore({
    reducer: {
        session_key: session_key.reducer,
        user: user.reducer,
        server:server.reducer
    }
}) 