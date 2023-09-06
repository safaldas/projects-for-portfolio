import { createSlice } from "@reduxjs/toolkit";




const initialState = {
  user: [],
  isAdmin: false,
}

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action) => {

      state.user = action.payload
    },
    setIsAdmin: (state, action) => {
      state.isAdmin = action.payload
    },

  }
})

export const { setUser, setIsAdmin } = usersSlice.actions;

export default usersSlice.reducer;