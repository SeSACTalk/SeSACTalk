import { createSlice } from '@reduxjs/toolkit'

let role = createSlice({
    name: 'role',
    initialState: null,
    reducers: {
        setRole(state, action) {
            return action.payload
        }
    }
});

export default role;
export let { setRole } = role.actions;
