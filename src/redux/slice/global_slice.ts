import { createSlice } from "@reduxjs/toolkit";
import { GlobalModel } from "../model/global-model/Global_model";

const initialState: GlobalModel = {
  globalData: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "global",
  initialState,
  reducers: {},
  extraReducers: () => {},
});

export const {} = userSlice.actions;
export default userSlice.reducer;
