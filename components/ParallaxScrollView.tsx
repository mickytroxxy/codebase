import { useEffect, useState, type PropsWithChildren, type ReactElement } from 'react';
import { StyleSheet, Platform, Keyboard } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  headerHeight: number;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  automaticallyAdjustKeyboardInsets?: boolean;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  headerHeight:hH,
  keyboardShouldPersistTaps = 'handled',
  automaticallyAdjustKeyboardInsets = true,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();
  const [headerHeight,setHeaderHeight] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    setHeaderHeight(hH)
  },[hH])

  // Keyboard handling for iOS
  useEffect(() => {
    if (Platform.OS === 'ios') {
      const keyboardWillShowListener = Keyboard.addListener(
        'keyboardWillShow',
        (e) => {
          setKeyboardHeight(e.endCoordinates.height);
        }
      );
      const keyboardWillHideListener = Keyboard.addListener(
        'keyboardWillHide',
        () => {
          setKeyboardHeight(0);
        }
      );

      return () => {
        keyboardWillHideListener?.remove();
        keyboardWillShowListener?.remove();
      };
    }
  }, []);
  
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        scrollIndicatorInsets={{ bottom }}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        automaticallyAdjustKeyboardInsets={automaticallyAdjustKeyboardInsets && Platform.OS === 'ios'}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? Math.max(bottom, keyboardHeight) : bottom
        }}>
        <Animated.View
          style={[
            {height:headerHeight,overflow:'hidden'},
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerAnimatedStyle,
          ]}>
          {headerImage}
        </Animated.View>
        <ThemedView style={[styles.content,styles.footerStyle]}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  header: {
    height: 250,
    overflow: 'hidden',
  },
  content: {
    padding: 0,
    gap: 16,
    overflow: 'hidden',
  },
  footerStyle: {
    flex: 1,
    padding: 20,
    minHeight: 500,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    marginTop:-30,
    shadowOpacity: 0.1,
    elevation: 10,
    paddingBottom:0
  },
});

