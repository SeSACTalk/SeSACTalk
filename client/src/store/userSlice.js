import { createSlice } from '@reduxjs/toolkit'

let session_key = createSlice({
    name: 'session_key',
    initialState: '',
    reducers: {
        changeSession(state, action) {
            state = action.payload
        }
    }
})

export default session_key; // state export
export let { changeSession } = session_key.actions // state 변경 함수 export