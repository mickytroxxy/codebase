import { useEffect, useState } from 'react';
import * as Updates from 'expo-updates';
import { Alert, Platform } from 'react-native';

export const useOTA = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (__DEV__) {
      // Skip OTA updates in development
      return;
    }

    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setIsUpdateAvailable(true);
        showUpdateAlert();
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };

  const showUpdateAlert = () => {
    Alert.alert(
      'Update Available',
      'A new version of the app is available. Would you like to update now?',
      [
        {
          text: 'Later',
          style: 'cancel',
        },
        {
          text: 'Update',
          onPress: downloadAndInstallUpdate,
        },
      ]
    );
  };

  const downloadAndInstallUpdate = async () => {
    try {
      setIsUpdating(true);
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (error) {
      console.error('Error updating app:', error);
      Alert.alert('Update Failed', 'Failed to update the app. Please try again later.');
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdateAvailable,
    isUpdating,
    checkForUpdates,
    downloadAndInstallUpdate,
  };
};
