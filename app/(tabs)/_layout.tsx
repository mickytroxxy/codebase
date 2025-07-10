import { Tabs, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, View } from 'react-native';
import { colors } from '@/constants/Colors';
import useAuth from '@/src/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { setActiveUser } from '@/src/state/slices/accountInfo';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  const { accountInfo } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: isDark ? '#1C1C1E' : '#222240',
          borderTopColor: isDark ? '#2C2C2E' : '#E5E5EA',
          height: 60,
          paddingBottom: 8,
        },
        
        headerStyle: {
          backgroundColor: colors?.primary,
        },
        headerTintColor: colors.white,
        tabBarLabelStyle: {
          fontFamily: 'fontBold',
          fontSize: 10,
        },
        headerTitle:'',
        headerTitleStyle: {fontFamily:'fontBold',fontSize:12},
        headerLeft:() =>
          <View>
            <Image source={require('@/assets/images/play.png')} style={{height:40,aspectRatio:4,marginLeft:10}} resizeMode='contain' />
          </View>
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Connect',
          tabBarIcon: ({ color }) => <FontAwesome name="headphones" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: 'Apparel',
          tabBarIcon: ({ color }) => <FontAwesome name="shopping-bag" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color }) => <FontAwesome name="search" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={({ navigation }) => ({
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome name='user-circle' size={24} color={color} />,
        })}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            if (accountInfo) {
              dispatch(setActiveUser(accountInfo));
              navigation.navigate('profile');
            } else {
              router.push('/login');
            }
          },
        })}
      />
    </Tabs>
  );
}
