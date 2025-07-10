import { Alert, Dimensions, Linking, Platform, Text, ToastAndroid } from "react-native";

import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-root-toast';
// Alternative: import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { updateData } from "./api";
import * as Device from 'expo-device';
import axios from "axios";
import { LocalTrack } from "@/constants/Types";
import { Song } from "../state/slices/musicPlayer";
import * as MediaLibrary from 'expo-media-library';

export {Notifications}
Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
});



export const loadAudioFiles = async () => {
  try {
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      first: 1000, // Limit to 1000 files for performance
      sortBy: [[MediaLibrary.SortBy.creationTime, false]]
    });
    const tracks: LocalTrack[] = await Promise.all(
      media.assets.map(async (asset) => {
        const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
        const type = asset.mediaType;
        const fileName = asset.filename;
        const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        let artist = '';
        let title = nameWithoutExt;

        if (nameWithoutExt.includes(' - ')) {
          const parts = nameWithoutExt.split(' - ');
          artist = parts[0];
          title = parts.slice(1).join(' - ');
        }

        return {
          id: asset.id,
          title: title,
          artist: artist,
          albumArt: 'https://mrdocs.empiredigitals.org/playIcon.png', // Placeholder album art
          url: asset.uri,
          duration: asset.duration,
          localUri: assetInfo.localUri || asset.uri,
          fileName: asset.filename,
          fileSize: 0, // Not available directly from MediaLibrary
          genres: [],
          uploadProgress: 0,
          uploadStatus: 'idle',
          type,
          action: 'play',
          isPlaying: false
        };
      })
    );
    return tracks;
  } catch (error) {
    console.error('Error loading audio files:', error);
    return []
  }
};
export const formatPlayCount = (count: number | string | undefined): string => {
  if (count === undefined) return '0';

  const num = typeof count === 'string' ? parseFloat(count) : count;

  if (isNaN(num)) return '0';

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  } else {
    return num.toString();
  }
};
export const showToast = (message: string): void => {
  if (Platform.OS === 'android') {
    if(message.length > 0){
      ToastAndroid.show(message, ToastAndroid.LONG);
    }
  } else {
    try {
      // iOS toast with better configuration
      Toast.show(message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        textColor: '#ffffff',
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        containerStyle: {
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 25,
          marginHorizontal: 20,
        },
      });
    } catch (error) {
      // Fallback to Alert if Toast fails
      console.warn('Toast failed, using Alert fallback:', error);
      Alert.alert('Notification', message);
    }
  }
};
export const getHeight = () => {
  const { height } = Dimensions.get('screen');
  if(height < 740){
    return 525
  }else{
    if(Platform.OS === 'android'){
      return 400
    }else{
      return 600
    }
  }
}
export const sendSms = (phoneNo: string, msg: string,auth:string): void => {
  const request = new XMLHttpRequest();
  request.open('POST', 'https://rest.clicksend.com/v3/sms/send');
  request.setRequestHeader('Content-Type', 'application/json');
  request.setRequestHeader('Authorization', 'Basic '+auth);
  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      showToast(`Message sent to ${phoneNo}`);
    }
  };

  const body = {
    'messages': [
      {
        'source': 'javascript',
        'from': "uberFlirt",
        'body': msg,
        'to': phoneNo,
        'schedule': '',
        'custom_string': ''
      }
    ]
  };

  request.send(JSON.stringify(body));
};
export const timeAgo = (timestamp: number): string => {
  const now = Date.now();
  const secondsPast = (now - timestamp) / 1000;

  if (secondsPast < 60) {
    return `${Math.floor(secondsPast)} seconds ago`;
  }
  if (secondsPast < 3600) {
    return `${Math.floor(secondsPast / 60)} minutes ago`;
  }
  if (secondsPast < 86400) {
    return `${Math.floor(secondsPast / 3600)} hours ago`;
  }
  if (secondsPast < 2592000) { // Less than 30 days
    return `${Math.floor(secondsPast / 86400)} days ago`;
  }
  if (secondsPast < 31536000) { // Less than 1 year
    return `${Math.floor(secondsPast / 2592000)} months ago`;
  }
  return `${Math.floor(secondsPast / 31536000)} years ago`;
}
export const calculateDurationInHHMM = (startTimestamp: string): string => {
  if(startTimestamp){
    const startTime = new Date(startTimestamp);
    const currentTime = new Date();

    const durationInMilliseconds = currentTime.getTime() - startTime.getTime();

    const minutes = Math.floor((durationInMilliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((durationInMilliseconds / (1000 * 60 * 60)) % 24);

    // Add leading zeros if necessary
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}.${formattedMinutes}`;
  }else{
    return '00.00'
  }
};
export const phoneNoValidation = (phone: string, countryCode: string): string | false => {
  // Clean up inputs
  let cleanPhone = phone.replace(/[^0-9+]/g, ''); // Remove all non-numeric characters except +
  let cleanCountryCode = countryCode.replace(/[^0-9+]/g, ''); // Remove all non-numeric characters except +

  // Remove + from country code if present
  if (cleanCountryCode.startsWith('+')) {
    cleanCountryCode = cleanCountryCode.slice(1);
  }

  // Check if phone number already has country code
  const hasCountryCode = cleanPhone.startsWith('+') ||
                        cleanPhone.startsWith(cleanCountryCode) ||
                        (cleanPhone.startsWith('00') && cleanPhone.slice(2, 2 + cleanCountryCode.length) === cleanCountryCode);

  // If phone number already has country code, validate and return it
  if (hasCountryCode) {
    let finalNumber = cleanPhone;

    // Remove + if present
    if (finalNumber.startsWith('+')) {
      finalNumber = finalNumber.slice(1);
    }

    // Remove 00 prefix if present
    if (finalNumber.startsWith('00')) {
      finalNumber = finalNumber.slice(2);
    }

    // Validate length (country code + number)
    if (finalNumber.length >= 10 && finalNumber.length <= 15) {
      return finalNumber; // Return without + prefix
    }
    return false;
  }

  // If phone number doesn't have country code, add it
  let finalNumber = cleanPhone;

  // Remove leading 0 if present
  if (finalNumber.startsWith('0')) {
    finalNumber = finalNumber.slice(1);
  }

  // Combine country code and number
  finalNumber = cleanCountryCode + finalNumber;

  // Validate final length
  if (finalNumber.length >= 10 && finalNumber.length <= 15) {
    return finalNumber; // Return without + prefix
  }

  return false;
};

export const nativeLink = (type: string, obj: { lat?: number; lng?: number; label?: string; phoneNumber?: string; email?: string }): void => {
    if (type === 'map') {
      const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
      const latLng = `${obj.lat},${obj.lng}`;
      const label = obj.label;
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`
      }) as string; // Type assertion here
      Linking.openURL(url);
    } else if (type === 'call') {
      let phoneNumber = obj.phoneNumber;
      if (Platform.OS !== 'android') {
        phoneNumber = `telprompt:${obj.phoneNumber}`;
      } else {
        phoneNumber = `tel:${obj.phoneNumber}`;
      }
      Linking.canOpenURL(phoneNumber)
        .then((supported) => {
          if (!supported) {
            Alert.alert('Phone number is not available');
          } else {
            return Linking.openURL(phoneNumber || '');
          }
        })
        .catch((err) => console.log(err));
    } else if (type === 'email') {
      Linking.openURL(`mailto:${obj.email}`);
    }else if (type === 'whatsapp') {
      const url = `whatsapp://send?phone=${obj.phoneNumber}&text=${encodeURIComponent(`Hello there! I'd like to introduce you to PlayMyJam — the ultimate music-sharing app that lets you connect with your partner or bid to have your song played in pubs. Visit www.playmyjam.empiredigitals.org to download.`)}`;
      Linking.openURL(url);
    }
};
export const sendPushNotification = async (to: string | null | undefined, title: string, body: string, data: {route:string,user:any}): Promise<void> => {
  if (!to || !to.startsWith('ExponentPushToken')) {
    console.log('Invalid or missing Expo push token:', to);
    return;
  }

  const message = {
    to,
    sound: 'default',
    title,
    body,
    data,
    priority: 'high' as const,
    channelId: 'default'
  };

  try {
    console.log('Sending Expo push notification:', message);

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Expo push notification failed:', result);
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(result)}`);
    }

    console.log('Expo push notification sent successfully:', result);
  } catch (error) {
    console.error('Error sending Expo push notification:', error);
    throw error;
  }
};

export const getDistance = (lat1: number, lon1: number, lat2: number | any, lon2: number | any): number => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const radLat1 = toRad(lat1);
    const radLat2 = toRad(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return d;
};

const toRad = (value: number): number => {
    return value * Math.PI / 180;
};
export const takePicture = async (type:string) => {
  try {
      // const permissionRes = await ImagePicker.requestCameraPermissionsAsync();
      // const { granted } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
      // if(granted || permissionRes.granted){
      //     let result = await ImagePicker.launchCameraAsync({
      //         allowsEditing: true,
      //         base64:false,
      //         aspect: type === "avatar" ? [1, 1] : undefined,
      //         quality: 0.5,
      //     });
      //     if (!result.canceled) {
      //       return result.assets
      //     }
      // }
  } catch (error) {
      alert(JSON.stringify(error))
  }
}
export const currencyFormatter = (amount:any) => `ZAR ${parseFloat(amount).toFixed(2)}`
export const pickImage = async (type:string) => {
  try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if(permissionResult.granted){
          let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: (type === 'posts' ? ImagePicker.MediaTypeOptions.All : ImagePicker.MediaTypeOptions.Images),
              allowsEditing: true,
              base64:false,
              aspect: type === "avatar" ? [1, 1] : undefined,
              quality: 1,
          });
          if (!result.canceled) {
            return result.assets
          }
      }
  } catch (error) {
    showToast('Something went wrong')
  }
};

export const registerForPushNotificationsAsync = async(clientId:any)=> {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return;
    }
    await Notifications.getExpoPushTokenAsync().then((res) => {
      const notificationToken = res.data;
      if(clientId){
        console.log('Found it ',notificationToken)
        updateData("users",clientId,{value:notificationToken,field:'notificationToken'})
      }
    })
  }
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return token;
}
export const PREVIEW_SIZE = 300;
const { height, width } = Dimensions.get('screen');
export const PREVIEW_RECT = {
  minX: (width - PREVIEW_SIZE) / 2,
  minY: 50,
  width: PREVIEW_SIZE,
  height: PREVIEW_SIZE,
};

export const detectFaces = (result: any,detections:any[],currentIndexRef:any, instructions:any, setInstructions:any, handleIndex:any) => {
  const currentDetection = detections[currentIndexRef.current < 5 ? currentIndexRef.current : 4];
  console.log(result)
  if (result.faces.length !== 1) {
    currentIndexRef.current = 0;
    setInstructions({ status: false, text: 'Position your face in the circle and then' })
    return;
  }

  const face = result.faces[0];
  const faceRect = {
    minX: face.bounds.origin.x,
    minY: face.bounds.origin.y,
    width: face.bounds.size.width,
    height: face.bounds.size.height,
  };
  const edgeOffset = 50;
  const faceRectSmaller = {
    width: faceRect.width - edgeOffset,
    height: faceRect.height - edgeOffset,
    minY: faceRect.minY + edgeOffset / 2,
    minX: faceRect.minX + edgeOffset / 2,
  };
  const previewContainsFace = contains({ outside: PREVIEW_RECT, inside: faceRectSmaller });

  if (!previewContainsFace) {
    setInstructions({ status: false, text: 'Position your face in the circle and then' })
    return;
  }

  const faceMaxSize = PREVIEW_SIZE - 90;

  if (faceRect.width >= faceMaxSize && faceRect.height >= faceMaxSize) {
    setInstructions({ status: false, text: "You're too close. Hold the device further and then" })
    return;
  }

  if (previewContainsFace && !(faceRect.width >= faceMaxSize && faceRect.height >= faceMaxSize)) {
    if (!instructions.status) {
      setInstructions({ status: true, text: 'Keep the device still and perform the following actions:' });
    }
  }


  if (currentDetection.type === 'BLINK') {
    const leftEyeClosed = face.leftEyeOpenProbability <= currentDetection.minProbability;
    const rightEyeClosed = face.rightEyeOpenProbability <= currentDetection.minProbability;
    if (leftEyeClosed && rightEyeClosed) {
      handleIndex(1);
    }
  }
  if (currentDetection.type === 'BLINK_RIGHT_EYE') {
    console.log(face.leftEyeOpenProbability , currentDetection.minProbability)
    const leftEyeClosed = face.leftEyeOpenProbability <= currentDetection.minProbability;
    const rightEyeClosed = face.rightEyeOpenProbability <= currentDetection.minProbability;
    if (leftEyeClosed && !rightEyeClosed) {
      handleIndex(2);
    }
  }

  if (currentDetection.type === 'TURN_HEAD_RIGHT') {
    if (face.yawAngle < 60) {
      handleIndex(4);
    }
  }

  if (currentDetection.type === 'TURN_HEAD_LEFT') {
    if (face.yawAngle >= 150) {
      handleIndex(3);
    }
  }

  if (currentDetection.type === 'SMILE') {
    if (face.smilingProbability > 0.5) {
      handleIndex(5);
    }
  }
};
export function contains({ outside, inside }: { outside: any; inside: any }): boolean {
  const outsideMaxX = outside.minX + outside.width;
  const insideMaxX = inside.minX + inside.width;

  const outsideMaxY = outside.minY + outside.height;
  const insideMaxY = inside.minY + inside.height;

  if (inside.minX < outside.minX) {
    return false;
  }
  if (insideMaxX > outsideMaxX) {
    return false;
  }
  if (inside.minY < outside.minY) {
    return false;
  }
  if (insideMaxY > outsideMaxY) {
    return false;
  }

  return true;
}
export const handlePickCoverImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'You need to grant access to your photo library to select a cover image.');
        return false;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled) {
        return result.assets[0].uri
      }
    } catch (error) {
      console.error('Error picking image:', error);
      return false
    }
};
export const convertToMusicListFormat = (tracks: LocalTrack[]): Song[] => {
    return tracks.map(track => ({
      id: track.id || Math.random().toString(36).substring(2, 15),
      title: track.title,
      artist: track.artist,
      albumArt: track.albumArt || 'https://mrdocs.empiredigitals.org/playIcon.png',
      url: track.localUri || '',
      duration: track.duration || 0,
      active: true,
      isLocal: true,
      uploadProgress: track.uploadProgress,
      uploadStatus: track.uploadStatus
    }));
};