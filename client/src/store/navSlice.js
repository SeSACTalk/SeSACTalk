import { createSlice } from '@reduxjs/toolkit'

let exploreNav = createSlice({
    name: 'exploreNav',
    initialState: false,
    reducers: {
        showExploreNav(state, action) {
            return !state
        }
    }
})

export { exploreNav };
export let { showExploreNav } = exploreNav.actions;
