import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
};

const userSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    storeData: (state, action) => {
      state["userData"] = action.payload;
    },
  },
});

export const { storeData } = userSlice.actions;

export default userSlice.reducer;
