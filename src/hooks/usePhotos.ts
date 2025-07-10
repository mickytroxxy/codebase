import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import useLoader from "./useLoader";
import { RootState } from "../state/store";
import { updateData, uploadFile } from "../helpers/api";
import { showToast } from "../helpers/methods";
import { setCallback } from "../state/slices/camera";
import { setActiveUser } from "../state/slices/accountInfo";
import { setAccountInfo } from "../state/slices/accountInfo";
import moment from "moment";

export const usePhotos = () => {
    const router = useRouter();
    const {updateLoadingState} = useLoader();
    const dispatch = useDispatch();
    const {accountInfo,activeUser} = useSelector((state: RootState) => state.accountSlice);
    
    const handleChange = (field: string, value: string | any) => {
        if (field == 'birthDay') {
            value = moment(value).format("L");
        }
        dispatch(setActiveUser({ ...activeUser, [field]: value }));
        dispatch(setAccountInfo({ ...accountInfo, [field]: value }));
        updateData("users", (accountInfo?.userId || ''), { field, value });
    };
    
    const uploadPhotos = async ({fileUrl,field}:{fileUrl:any,field:string}) => {
        updateLoadingState(true,'Uploading your file, please wait...')
        let location = `${field}/${accountInfo?.userId || ''}`;
        if(field === "photos"){
            location = `${field}/${accountInfo?.userId}/${(Date.now() +  Math.floor(Math.random()*89999+10000)).toString()}`;
        }
        const url = await uploadFile(fileUrl,location)
        const photoId = (Date.now() + Math.floor(Math.random() * 899 + 1000)).toString()
        const value = [...accountInfo?.photos || [],{photoId,url}]
        const response = await updateData("users",accountInfo?.userId || '',{field,value:field === 'photos' ? value : url})
        
        if(response){
            const updatedData = {...accountInfo,[field] : field === 'photos' ? value : url}
            dispatch(setAccountInfo(updatedData))
            dispatch(setActiveUser(updatedData))
            showToast("Your "+field+" has Been Successfully Changed!");
            updateLoadingState(false,'')
        }
    }
    const handleOtherPhotos = (field:'idPhoto' | 'avatar' | 'photos') => {
        dispatch(setCallback(uploadPhotos));
        router.push({pathname:'/CameraScreen',params:{type:field,action:'profile',data:''}})
    }
    const handleProductPhotos = (getPhotos:(path:any) => any) => {
        dispatch(setCallback(getPhotos));
        router.push({pathname:'/CameraScreen',params:{type:'photos',action:'profile',data:''}})
    }
    return { handleOtherPhotos, handleChange, handleProductPhotos}
}