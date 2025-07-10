import { registerRootComponent } from 'expo';
import TrackPlayer from 'react-native-track-player';

// Import your main app component
import App from './App';

// Register the playback service
TrackPlayer.registerPlaybackService(() => require('./service'));

// Register the main component
registerRootComponent(App);
