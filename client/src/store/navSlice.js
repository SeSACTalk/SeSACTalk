import { createSlice } from '@reduxjs/toolkit'

let minNav = createSlice({
    name: 'minNav',
    initialState: false,
    reducers: {
        showMinNav(state, action) {
            return !state
        }
    }
})

let exploreNav = createSlice({
    name: 'exploreNav',
    initialState: false,
    reducers: {
        showExploreNav(state, action) {
            return !state
        }
    }
})

let noticeNav = createSlice({
    name: 'noticeNav',
    initialState: false,
    reducers: {
        showNoticeNav(state, action) {
            return !state
        }
    }
})

export { minNav, exploreNav, noticeNav };
export let { showMinNav } = minNav.actions;
export let { showExploreNav } = exploreNav.actions;
export let { showNoticeNav } = noticeNav.actions;
