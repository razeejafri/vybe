import { createSlice } from "@reduxjs/toolkit"

const messageSlice = createSlice({
  name: "message",
  initialState: {
    selectedUser: null,   // ✅ FIXED: changed from "userDate"
    messages: [],                                                                 //for same conver
    prevChatUsers: null
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload; // ✅ FIXED
    },
    setMessages: (state, action) => {
      state.messages = action.payload; // ✅ FIXED
    },
    setPrevChatUsers: (state, action) => {
      state.prevChatUsers = action.payload; // ✅ FIXED
    },
  }
});

export const { setSelectedUser, setMessages, setPrevChatUsers } = messageSlice.actions;
export default messageSlice.reducer;
