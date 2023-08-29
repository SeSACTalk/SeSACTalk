import { configureStore, createSlice } from '@reduxjs/toolkit'
import user from './store/uesrSlice.js'

export default configureStore({
    reducer: {
        user: user.reducer,
    }
}) 