
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
export interface SecretsType {
  OPENAI_API: string;
  appleApproved:boolean;
  canShowAds:boolean;
  playFee:number;
  bidShare:number;
  appId:string;
  WHATSAPP: string;
  SMS_AUTH: string;
  SMS_KEY: string;
  canSendSms: boolean;
  googleApiKey:string;
  googleApiKeyActive:boolean;
  deliveryFee:number;
  vatFee:number,
  premiumPlaysLastClaimedDate:number;
  premiumFee:number;
  baseUrl:string;
  clubPremium:number
}
const initialState: {secrets:SecretsType} = {
  secrets:{
    OPENAI_API:'sk-w0P9FsPYsEqDDKSVHWX6ahkmgv8BvzPhP_IBVR8SPJT3BlbkFJw2cGST5ZluAPBb_YOaS_6-uoQdzPga8CuBpI6qZuAA',
    appleApproved:false,
    WHATSAPP:'27736120177',
    clubPremium:750,
    SMS_AUTH:'aW5mb0BlbXBpcmVkaWdpdGFscy5vcmc6ZW1waXJlRGlnaXRhbHMxIUA=',
    SMS_KEY:"aW5mb0BlbXBpcmVkaWdpdGFscy5vcmc6ZW1waXJlRGlnaXRhbHMxIUA=",
    googleApiKey:'',
    googleApiKeyActive:true,
    deliveryFee:200,
    vatFee:0,
    canShowAds:true,
    canSendSms:false,
    premiumPlaysLastClaimedDate:0,
    premiumFee:75,
    playFee:0.5,
    bidShare:0.5,
    baseUrl:'https://play-server-913115376008.europe-west1.run.app',
    appId:'LA10613716',
  },
};

const globalVariables = createSlice({
  name: "globalVariables",
  initialState,
  reducers: {
    setSecrets: (state, action: PayloadAction<SecretsType>) => {
      state.secrets = action.payload;
    },
  },
});

export const {setSecrets } = globalVariables.actions;
export default globalVariables.reducer;
