import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,   // ✅ FIXED: changed from "userDate"
    suggestedUsers: null,
    profileData: null,
    following: [],                        // (list)following particular users
    needsRefetch: true,
    searchData: null,
    notificationData: []
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload; // ✅ FIXED
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload; // ✅ FIXED
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload
    },
    setFollowing: (state, action) => {
      state.following = action.payload
    },
    toggleFollow: (state, action) => {                      //follow/unfollow
      const targetUserId = action.payload
      if(state.following.includes(targetUserId)){
        state.following = state.following.filter(id => id != targetUserId)
      } else {
        state.following.push(targetUserId)
      }
    },
    setNeedsRefetch: (state, action) => {
    state.needsRefetch = action.payload
    },
    setSearchData: (state, action) => {
    state.searchData = action.payload
    },
    setNotificationData: (state, action) => {
    state.notificationData = action.payload
    },
  }
});

export const { setUserData, setSuggestedUsers, setProfileData, setNotificationData, 
toggleFollow, setFollowing , setNeedsRefetch, setSearchData} = userSlice.actions;
export default userSlice.reducer;
