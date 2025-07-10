import { KeyboardTypeOptions, StyleProp, TouchableOpacityProps, ViewStyle } from "react-native"

export type UserRole = 'user' | 'admin';
export interface AccountInterface {
  role?: UserRole;
  userId?: string;
  notificationToken?: string;
  code?: number | string;
  acceptTerms?: boolean;
  password?: string;
  photos?: {
    photoId: number;
    url: string;
  }[];
  about?: string;
  deleted?: boolean;
  address?: LocationType;
  fname?: string;
  lname?: string;
  phoneNumber?: string;
  geoHash?: string;
  balance?: number;
  fname_lower?: string;
  avatar?: string;
  isVerified?: boolean;
  date?: number;
  image?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export type IconType = {
    size?:number,
    color:string,
    type:string,
    name:string,
    min?:number
}
export interface TextAreaProps {
  attr: {
    icon: IconType;
    placeholder: string;
    keyboardType?: KeyboardTypeOptions;
    field: string;
    value?: string;
    color?:string;
    height?:any;
    multiline?:boolean;
    isSendInput?:boolean;
    borderRadius?:number;
    onSendClicked?: () => any;
    onFocus?: () => any;
    editable?: boolean;
    handleChange: (field: string, value: string) => any;
  };
  style?: StyleProp<ViewStyle>;
}
export interface ButtonProps extends TouchableOpacityProps {
    btnInfo?: {
      styles?: StyleProp<ViewStyle>;
    };
    textInfo?: {
      text?: string;
      color?: string;
    };
    iconInfo: IconType;
    handleBtnClick: () => void;
}
export interface IconButtonProps {
  iconInfo: IconType;
  handleBtnClick: () => void;
}
export interface AddressButtonProps {
  handleBtnClick: (value:LocationType) => void;
  placeholder?:string;
}
export type LocationType = {
  latitude:number;
  longitude:number;
  text?:string;
  short_name?:string;
  long_name?:string
}
export interface DateButtonProps {
  handleBtnClick: (value:string) => void;
  placeholder?:string;
  mode: 'date' | 'time'
}
export type CountryDataType = {
  dialCode:string;
  name:string;
  flag:string;
}
export type ConfirmDialogType = {
  isVisible: boolean,
  text: string,
  okayBtn: string,
  cancelBtn: string,
  hasHideModal:boolean,
  isSuccess?: boolean,
  response?:any,
  severity?:boolean
}
export type LocationInputProps = {
  handleChange: (field: string, value: object) => void;
  field: string;
  placeHolder: string;
};

// Generic configuration type for app settings
export interface AppConfigType {
  apiKey?: string;
  baseUrl?: string;
  appId?: string;
  supportContact?: string;
  features?: {
    [key: string]: boolean;
  };
  settings?: {
    [key: string]: any;
  };
}
