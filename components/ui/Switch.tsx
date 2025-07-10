import { colors } from "@/constants/Colors";
import { Text, View } from "react-native";
import { Switch, TouchableRipple } from "react-native-paper";
import Icon from "./Icon";
import Hyperlink from 'react-native-hyperlink'

type SwitchProps = {
    attr:{
        title:string;
        value:boolean;
        handleChange:() => any;
    }
}
export const CustomSwitch = ({attr}:SwitchProps) => {
    const {title,value,handleChange} = attr;
    return(
        <View style={{flexDirection:'row',borderBottomColor:colors.faintGray,borderBottomWidth:0.7,marginTop:12,paddingVertical:12}}>
            <View style={{width:30,justifyContent:'center'}}>
                <Icon type='MaterialCommunityIcons' name="toggle-switch-outline" size={30} color={value ? colors.green : colors?.grey}/>
            </View>
            <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                <Hyperlink 
                    linkDefault={ true }
                    linkStyle={ { color: '#2980b9'} }
                    linkText={ url => url === 'https://playmyjam.empiredigitals.org/terms' ? 'Terms & Conditions' : url }
                >
                    <Text style={{color:'#2a2828',fontFamily:'fontBold',paddingLeft:15,fontSize:12}}>{title}</Text>
                </Hyperlink>
            </View>
            <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                <TouchableRipple onPress={handleChange}>
                    <View>
                        <View pointerEvents="none">
                            <Switch value={value as any} color={colors.green} />
                        </View>
                    </View>
                </TouchableRipple>
            </View>
        </View>
    )
}