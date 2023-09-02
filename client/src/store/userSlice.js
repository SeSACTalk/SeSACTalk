import { createSlice } from '@reduxjs/toolkit'

let user = createSlice({
    name: 'user',
    initialState: '',
    reducers: {
        changeUser(state, action) {
            return action.payload
        }
    }
})

export default user;
export let { changeUser } = user.actions;