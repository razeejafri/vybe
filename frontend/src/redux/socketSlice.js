import { createSlice } from "@reduxjs/toolkit"

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,   // ✅ FIXED: changed from "userDate"                                  
    onlineUsers: null
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload; // ✅ FIXED
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload; // ✅ FIXED
    },
  }
});

export const { setSocket, setOnlineUsers } = socketSlice.actions;
export default socketSlice.reducer;