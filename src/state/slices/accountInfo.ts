import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {AccountInterface} from "@/constants/Types";

const initialState: {
  accountInfo:AccountInterface | null,
  activeUser:AccountInterface | null
} = {
  accountInfo:null,
  activeUser:null
};

const accountSlice = createSlice({
  name: "accountSlice",
  initialState,
  reducers: {
    setAccountInfo: (state, action: PayloadAction<AccountInterface | null>) => {
      state.accountInfo = action.payload;
    },
    setActiveUser: (state, action: PayloadAction<AccountInterface | null>) => {
      state.activeUser = action.payload;
    }
  },
});

export const { setAccountInfo, setActiveUser } = accountSlice.actions;
export default accountSlice.reducer;
