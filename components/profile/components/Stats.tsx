import { colors } from "@/constants/Colors";
import { currencyFormatter, showToast } from "@/src/helpers/methods";
import useAuth from "@/src/hooks/useAuth";
import {Text, TouchableOpacity, View, Linking } from "react-native";
import { router } from "expo-router";
import Icon from "@/components/ui/Icon";
import { useDispatch } from "react-redux";
import { setModalState } from "@/src/state/slices/modalState";
import { setActiveUser } from "@/src/state/slices/accountInfo";
import { useEffect, useState, useCallback } from "react";
import { setConfirmDialog } from "@/src/state/slices/ConfirmDialog";
import { updateData } from "@/src/helpers/api";
import { usePhotos } from "@/src/hooks/usePhotos";


export default function Stats() {
    const {accountInfo,activeUser,profileOwner} = useAuth();
    const dispatch = useDispatch();


    
    return (
        <View style={{flexDirection:'row',borderBottomWidth:0.8,borderBottomColor:colors.faintGray,paddingBottom:12}}>
            {/* Left Section - Subscriber Count and Subscribe Button */}
            <View style={{flex:1,alignItems:'flex-start',justifyContent:'center'}}>
                <View style={{alignItems:'center',justifyContent:'center',gap:3}}>
                    {/* Always show subscriber count for everyone */}
                    <TouchableOpacity 
                        style={{alignItems:'center',justifyContent:'center'}}
                        onPress={() => {
                            
                        }}
                        disabled={false}
                    >
                        {profileOwner && <Icon name="heart" color={colors.tomato} type="FontAwesome" size={24}/>}
                        {!profileOwner && 
                            <Icon
                                name="heart"
                                color={colors.orange}
                                type="FontAwesome"
                                size={24}
                            />
                        }
                        <Text style={{fontFamily:'fontBold',fontSize:12}}>({0}) Followers</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Center Section - Balance or Connect */}
            <View style={{flex:1,justifyContent:'center',alignItems:'center',borderLeftWidth:0.8,borderLeftColor:colors.faintGray,borderRightWidth:0.8,borderRightColor:colors.faintGray}}>
                {profileOwner && <TouchableOpacity
                    style={{alignItems:'center',justifyContent:'center',gap:3}}
                    onPress={() => {}}
                >
                    <Text style={{fontFamily:'fontLight',fontSize:12}}>Balance</Text>
                    <Text style={{fontFamily:'fontBold',fontSize:12}}>{currencyFormatter(accountInfo?.balance || 0)}</Text>
                </TouchableOpacity>}

                {!profileOwner &&
                    <TouchableOpacity
                        style={{alignItems:'center',justifyContent:'center',gap:3}}
                        onPress={() => {}}
                    >
                        <Icon name="music-circle" color={colors.orange} type="MaterialCommunityIcons" size={24}/>
                        <Text style={{fontFamily:'fontBold',fontSize:12}}>Connect</Text>
                    </TouchableOpacity>
                }
            </View>

            {/* Right Section - WhatsApp */}
            <View style={{flex:1,alignItems:'flex-end',justifyContent:'center'}}>
                <TouchableOpacity onPress={() => {
                    
                }} style={{alignItems:'center',justifyContent:'center',gap:3}}>
                    <Icon name="whatsapp" color={colors.green} type="FontAwesome" size={24}/>
                    <Text style={{fontFamily:'fontBold',fontSize:12}}>{currencyFormatter('0')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}