import { configureStore, createSlice } from '@reduxjs/toolkit'
import session_key from './store/userSlice.js'

export default configureStore({
    reducer: {
        session_key: session_key.reducer,
    }
}) 