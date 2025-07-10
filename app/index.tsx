import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/state/store';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/Colors';

export default function Index() {
  const router = useRouter();
  const { accountInfo } = useSelector((state: RootState) => state.accountSlice);

  useEffect(() => {
    // Small delay to ensure Redux store is hydrated
    const timer = setTimeout(() => {
      if (accountInfo) {
        // User is logged in, redirect to tabs
        router.replace("/(tabs)");
      } else {
        // User is not logged in, redirect to login
        router.replace("/(auth)/login");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [accountInfo, router]);

  // Show loading spinner while determining authentication state
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: colors.primary 
    }}>
      <ActivityIndicator size="large" color={colors.white} />
    </View>
  );
}
