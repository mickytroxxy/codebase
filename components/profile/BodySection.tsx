import { colors } from "@/constants/Colors";
import {StyleSheet, View, } from "react-native";
import Icon from "../ui/Icon";
import Stats from "./components/Stats";
import useAuth from "@/src/hooks/useAuth";
import { useRouter } from "expo-router";
import Photos from "./components/Photos";
import { useDispatch, useSelector } from "react-redux";

  

export default function BodySection() {
    return (
        <View style={{flex:1,paddingBottom:30}}>
            <View style={styles.ProfileFooterHeader}>
                <View style={{alignContent:'center',alignItems:'center'}}>
                    <Icon type="FontAwesome" name="ellipsis-h" color="#757575" size={36}/>
                </View>
            </View>
            <Stats/>
            <View style={{marginTop:12,gap:12,paddingBottom:100}}>
                <Photos/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    ProfileFooterHeader:{
        shadowOffset: {
            width: 0,
            height: 2,
        },
        marginTop:-15
    },
    clubSection: {
        marginTop: 20,
    },
    clubHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    clubTitle: {
        fontFamily: 'fontBold',
        fontSize: 12,
        color: colors.primary,
    },
    addClubButton: {
        alignItems: 'center',
        backgroundColor: colors.orange,
        height:36,width:36,
        borderRadius: 100,
        justifyContent:'center'
    },
    addClubText: {
        color: colors.white,
        fontFamily: 'fontBold',
        fontSize: 12,
    },
    clubList: {
        
    },
    clubCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        marginBottom: 10,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: colors.primary,
    },
    clubImage: {
        width: 110,
        height: 110,
    },
    clubInfo: {
        flex: 1,
        padding: 12,
    },
    clubName: {
        fontFamily: 'fontBold',
        fontSize: 12,
        color: colors.primary,
        marginBottom: 4,
    },
    clubLocation: {
        fontFamily: 'fontLight',
        fontSize: 12,
        color: colors.grey,
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontFamily: 'fontBold',
        fontSize: 12,
        color: colors.orange,
    },
});