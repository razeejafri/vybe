import { createSlice } from "@reduxjs/toolkit"

const loopSlice = createSlice({
  name: "loop",
  initialState: {
    loopData: [],   // ✅ FIXED: changed from "userDate"
  },
  reducers: {
    setLoopData: (state, action) => {
      state.loopData = action.payload; // ✅ FIXED
    }
  }
});

export const { setLoopData } = loopSlice.actions;
export default loopSlice.reducer;
