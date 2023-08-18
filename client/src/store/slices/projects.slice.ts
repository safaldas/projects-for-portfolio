import { createSlice } from "@reduxjs/toolkit";


interface ProjectSliceState {
  isSubmitted: boolean,
  page: number
}

const initialState: ProjectSliceState = {
    isSubmitted: false,
    page: 1
}

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setIsSubmitted: (state, action) => {
      state.isSubmitted = action.payload

    },

    setPage: (state, action) => {
        state.page = action.payload
  
      },
    addProject: (state, action) => {

      state.project = action.payload
      console.log(action,"in red pro")
    }

  }
})

export const { setIsSubmitted, addProject, setPage} = projectSlice.actions;

export default projectSlice.reducer;