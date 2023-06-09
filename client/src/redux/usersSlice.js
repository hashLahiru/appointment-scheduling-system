import { createSlice } from '@reduxjs/toolkit';

export const usersSlice = createSlice({
    name: "user",
    initialState: {
        user: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: (state, action) => {
            state.user = null;
        }
    },
});

export const { setUser, reloadUserData, clearUser } = usersSlice.actions;
