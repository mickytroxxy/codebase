import React, { memo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from '../ui/Icon';
import { colors } from '../../constants/Colors';
import { useDispatch } from 'react-redux';
import { setModalState } from '@/src/state/slices/modalState';
type PriceTypeProps = {
    attr:{
        status:boolean;
        message:string;
        cb?:() => void
    }
}
const SuccessStatus = memo((props:PriceTypeProps) => {
    const {status,message} = props.attr;
    const dispatch = useDispatch();
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center',marginTop:100,padding:20}}>
            {status && <TouchableOpacity onPress={() => {
                dispatch(setModalState({isVisible:false}))
                props?.attr?.cb && props?.attr?.cb();
            }}><Icon type='MaterialIcons' name="check-circle" size={160} color={colors.green} /></TouchableOpacity>}
            {!status && <TouchableOpacity onPress={() => {
                dispatch(setModalState({isVisible:false}))
                props?.attr?.cb && props?.attr?.cb();
            }}><Icon type='MaterialIcons' name="cancel" size={160} color={colors.tomato} /></TouchableOpacity>}
            <Text style={{fontFamily:'fontBold',fontSize:12,color:colors.grey,textAlign:'center'}}>{message}</Text>
        </View>
    )
})

export default SuccessStatus