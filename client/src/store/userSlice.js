import { createSlice } from '@reduxjs/toolkit'

let user = createSlice({
    name: 'user',
    initialState: '',
    reducers: {
        changeSession(state, action) {
            state = action.payload
        }
    }
})

export default user; // state export
export let { changeName, changeAge } = user.actions // state 변경 함수 export