import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../utils/api'

const initialState = {
    profile: null,
    init: false,
}

const login = createAsyncThunk("auth/login", async({email, password}) => {
    try {
        const res = await api.post('/auth/login', {email, password});
        return res.data;
    } catch (error) {
        if(error.response?.data)
            throw new Error(error.response.data)
        throw error;
    }
})

const signup = createAsyncThunk("auth/signup", async({name, email, password}) => {
    try {
        const res = await api.post('/auth/signup', {name, email, password});
        return res.data;
    } catch (error) {
        if(error.response?.data)
            throw new Error(error.response.data)
        throw error;
    }
})

const profile = createAsyncThunk("auth/profile", async() => {
    try {
        const res = await api.get('/auth/profile');
        return res.data;
    } catch (error) {
        if(error.response?.data)
            throw new Error(error.response.data)
        throw error;
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout (state) {
            state.profile = null;
            state.init = true;
        }
    },
    extraReducers: builder => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.profile = action.payload.profile;
        }).addCase(signup.fulfilled, (state, action) => {
            state.profile = action.payload.profile;
        }).addCase(profile.fulfilled, (state, action) => {
            state.profile = action.payload;
            state.init = true;
        }).addCase(profile.rejected, (state) => {
            state.profile = null;
            state.init = true;
        })
    }
})

export { login, signup, profile }
export const { logout } = authSlice.actions;

export default authSlice.reducer;