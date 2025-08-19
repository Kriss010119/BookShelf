import { createSlice } from '@reduxjs/toolkit';
import type { UserState } from "../../types/types.ts";

const initialState: UserState = {
    token: null,
    id: null,
    email: null,
    password: null,
    isLoading: true,
    username: null,
    avatarType: null,
    avatarImage: null,
    avatarColor: 'rgba(40,74,18,0.5)',
    isPublic: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setLoading(state) {
            state.isLoading = true;
        },
        setUser(state, action) {
            state.token = action.payload.token;
            state.id = action.payload.id;
            state.email = action.payload.email;
            state.password = action.payload.password;
            state.isLoading = false;
            state.avatarType = action.payload.avatarType;
            state.avatarImage = action.payload.avatarImage;
            state.avatarColor = action.payload.avatarColor;
            state.isPublic = action.payload.isPublic;
            state.username = action.payload.username;
        },
        removeUser(state) {
            state.token = null;
            state.id = null;
            state.email = null;
            state.password = null;
            state.isLoading = false;
            state.username = null;
            state.avatarType = null;
            state.avatarImage = null;
            state.avatarColor = 'rgba(40,74,18,0.5)';
            state.isPublic = false;
        },
        updateProfile(state, action) {
            state.username = action.payload.username;
            state.avatarType = action.payload.avatarType;
            state.avatarImage = action.payload.avatarImage;
            state.avatarColor = action.payload.avatarColor;
            state.isPublic = action.payload.isPublic;
        }
    }
})

export const { setUser, removeUser, setLoading, updateProfile } = userSlice.actions;
export default userSlice.reducer;