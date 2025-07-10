import 'react-native-gesture-handler';
import { Dimensions, Platform, TouchableOpacity, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Stack, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import BodySection from '@/components/profile/BodySection';
import HeaderSection from '@/components/profile/HeaderSection';
import { ThemedView } from '@/components/ThemedView';
import useAuth from '@/src/hooks/useAuth';
import { colors } from '@/constants/Colors';
import Icon from '@/components/ui/Icon';
import ModalController from '@/components/ui/modal';

const getHeight = () => {
  const { height } = Dimensions.get('screen');
  if(height < 740){
    return parseInt((0.5 * height).toFixed(0)) - 30
  }else{
    if(Platform.OS === 'android'){
      return parseInt((0.5 * height).toFixed(0)) - 30
    }else{
      const headerHeight = parseInt((0.5 * height).toFixed(0)) - 30
      return headerHeight
    }
  }
}

export default function ProfileScreen() {
  const [viewHeight, setViewHeight] = useState(getHeight());
  const {profileOwner, logOut, accountInfo} = useAuth();

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0) {
      setViewHeight(height);
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
       <Stack.Screen options={{
          headerRight: () => (profileOwner ? <TouchableOpacity onPress={logOut} style={{}}><Icon type="FontAwesome" name="sign-out" size={40} color={colors.tomato} /></TouchableOpacity> : null)
        }} />
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#000', dark: '#000' }}
        headerImage={
          <View onLayout={handleLayout} style={{ flex: 1 }}>
            <HeaderSection subscriberCount={0} />
          </View>
        }
        headerHeight={viewHeight}
      >
        <BodySection />
      </ParallaxScrollView>
    </ThemedView>
  );
}

