import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, RootState, store } from '@/src/state/store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { View } from 'react-native';
import { colors } from '@/constants/Colors';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import ModalController from '@/components/ui/modal';
import Loader from '@/components/ui/Loader';
import { setSecrets } from '@/src/state/slices/globalVariables';
import { RootSiblingParent } from 'react-native-root-siblings';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useOTA } from '@/src/hooks/useOTA';
import { getSecretKeys } from '@/src/helpers/api';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    fontLight: require('../assets/fonts/MontserratAlternates-Light.otf'),
    fontBold: require('../assets/fonts/MontserratAlternates-Bold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{flex:1}}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <PersistGate loading={null} persistor={persistor}>
          <Provider store={store}>
            <Main />
          </Provider>
          <StatusBar style='light' />
        </PersistGate>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const Main = () => {
  const ota = useOTA();
  const { isFetching } = useSelector((state: RootState) => state.modalState);
  const dispatch = useDispatch()

  useEffect(() => {
    (async() =>{
        const secrets = await getSecretKeys();
        if(secrets?.length > 0){
          dispatch(setSecrets(secrets[0]))
        }
    })()
},[])
  return (
    <RootSiblingParent>
      <View style={{flex:1}}>
        <ConfirmDialog/>
        <Stack
          screenOptions={{
            headerStyle: {backgroundColor: colors?.primary},
            headerTintColor: "#fff",
            headerBackTitle: '',
            headerBackButtonMenuEnabled:false,
            headerBackButtonDisplayMode:'minimal',
            headerTitleStyle: {fontFamily:'fontBold',fontSize:12},
            //headerLeft: () => (<TouchableOpacity onPress={() => router.back()} style={{marginRight:Platform.OS === 'android' ? 5 : 0,marginLeft:-10}}><Icon type="Feather" name="arrow-left-circle" size={30} color={colors.white} /></TouchableOpacity>)
          }}
        >
          <Stack.Screen name="(tabs)"  options={{ headerShown: false, headerTitle:'' }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/register" />
        </Stack>
        {isFetching.state && <Loader text={isFetching.text}/>}
        <ModalController/>
      </View>
    </RootSiblingParent>
  );
}
