import { createSlice } from "@reduxjs/toolkit"

const storySlice = createSlice({
  name: "story",
  initialState: {
    storyData: [],   // ✅ FIXED: changed from "userDate"                     current story jo story card me hm dekh rhe h
    storyList: null,                                                      // all followers story
    currentUserStory: null
  },
  reducers: {
    setStoryData: (state, action) => {
      state.storyData = action.payload; // ✅ FIXED
    },
    setStoryList: (state, action) => {
      state.storyList = action.payload; // ✅ FIXED
    },
    setCurrentUserStory: (state, action) => {
      state.currentUserStory = action.payload; // ✅ FIXED
    },
  }
});

export const { setStoryData , setStoryList, setCurrentUserStory} = storySlice.actions;
export default storySlice.reducer;
