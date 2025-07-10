import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '@/src/state/store';
import { Provider } from 'react-redux';
import TrackPlayer, { Capability } from 'react-native-track-player';

// Import Expo Router App
import ExpoRouterApp from './app/_layout';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function App() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('./assets/fonts/SpaceMono-Regular.ttf'),
    fontLight: require('./assets/fonts/MontserratAlternates-Light.otf'),
    fontBold: require('./assets/fonts/MontserratAlternates-Bold.otf'),
  });

  // Setup TrackPlayer
  useEffect(() => {
    const setupTrackPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer({});
        
        await TrackPlayer.updateOptions({
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
          ],
          notificationCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
        });
        
        console.log('TrackPlayer setup completed');
      } catch (error) {
        console.error('Error setting up TrackPlayer:', error);
      }
    };

    setupTrackPlayer();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ExpoRouterApp />
          <StatusBar style="auto" />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}
