import { createSlice } from '@reduxjs/toolkit'

let detailPath = createSlice({
    name: 'detailPath',
    initialState: '',
    reducers: {
        setDetailPath(state, action) {
            return action.payload
        }
    }
})

export default detailPath;
export let { setDetailPath } = detailPath.actions;
