import { createSlice } from "@reduxjs/toolkit"

const postSlice = createSlice({
  name: "post",
  initialState: {
    postData: [],   // ✅ FIXED: changed from "userDate"
  },
  reducers: {
    setPostData: (state, action) => {
      state.postData = action.payload; // ✅ FIXED
    }
  }
});

export const { setPostData } = postSlice.actions;
export default postSlice.reducer;
