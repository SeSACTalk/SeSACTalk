import { createSlice } from '@reduxjs/toolkit'

let session_key = createSlice({
    name: 'session_key',
    initialState: '',
    reducers: {
        changeSession(state, action) {
            return action.payload
        }
    }
})

let user = createSlice({
    name: 'user',
    initialState: '',
    reducers: {
        changeUser(state, action) {
            return action.payload
        }
    }
})

export { session_key, user }; // state export
export let { changeSession } = session_key.actions // state 변경 함수 export
export let { changeUser } = user.actions