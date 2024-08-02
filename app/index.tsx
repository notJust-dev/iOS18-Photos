import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
} from 'react-native';
import { photos } from '../data';
import Carousel from '../Carousel';
import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import Animated, {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export default function App() {
  const { height, width } = useWindowDimensions();
  const [headerCarouselPage, setHeaderCarouselPage] = useState(0);

  const scale = useSharedValue(1.2);
  const pageScrollViewPosition = useSharedValue(0);
  const gestureScrollPosition = useSharedValue(height / 2);

  const flatListRef = useAnimatedRef<Animated.FlatList<any>>();
  const pageScrollViewRef = useAnimatedRef<Animated.ScrollView>();

  const scrollMode = useSharedValue<'PAGE' | 'GESTURE' | 'FLAT_LIST'>('PAGE');
  const pageScrollEnabled = useDerivedValue(() => scrollMode.value === 'PAGE');
  const flatListScrollEnabled = useDerivedValue(
    () => scrollMode.value === 'FLAT_LIST'
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    scale.value = 1.2;
    scale.value = withTiming(1, { duration: 6000 });
  }, [headerCarouselPage]);

  useAnimatedReaction(
    () => scrollMode.value,
    (current, previous) => {
      if (current !== previous) {
        console.log('SCROLL MODE: ', current);
      }
    }
  );

  useAnimatedReaction(
    () => gestureScrollPosition.value,
    (current, previous) => {
      if (current === previous) {
        return;
      }

      if (current < height / 2 && scrollMode.value !== 'PAGE') {
        scrollMode.value = 'PAGE';
      }

      if (current === height && scrollMode.value !== 'FLAT_LIST') {
        scrollMode.value = 'FLAT_LIST';
      }
    }
  );

  const onPageScroll = useAnimatedScrollHandler((e) => {
    pageScrollViewPosition.value = e.contentOffset.y;
    if (e.contentOffset.y < 0 && scrollMode.value !== 'GESTURE') {
      scrollMode.value = 'GESTURE';
      scrollTo(pageScrollViewRef, 0, 0, true);
    }
  });

  const onFlatListScroll = useAnimatedScrollHandler((e) => {
    if (e.contentOffset.y < 0 && scrollMode.value === 'FLAT_LIST') {
      scrollMode.value = 'GESTURE';
      scrollTo(flatListRef, 0, 0, true);
    }
  });

  const onHeaderCarouselScroll = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const curPage = Math.max(
      0,
      Math.floor((e.nativeEvent.contentOffset.x + width / 2) / width)
    );
    if (curPage !== headerCarouselPage) {
      setHeaderCarouselPage(curPage);
    }
  };

  const gesture = Gesture.Pan()
    .onChange((e) => {
      gestureScrollPosition.value += e.changeY;
    })
    .onEnd((e) => {
      gestureScrollPosition.value = withTiming(
        e.velocityY > 0 ? height : height / 2
      );
    });

  const headerStyle = useAnimatedStyle(() => ({
    height: gestureScrollPosition.value,
  }));

  // const nativeGesture = Gesture.Native();
  // const composedGesture = Gesture.Simultaneous(gesture, nativeGesture);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.ScrollView
        ref={pageScrollViewRef}
        scrollEnabled={pageScrollEnabled}
        style={[styles.container]}
        onScroll={onPageScroll}
      >
        {/* Header */}
        <Animated.View style={headerStyle}>
          <ScrollView
            horizontal
            style={{ height: height / 2 }}
            snapToInterval={width}
            snapToAlignment="start"
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onScroll={onHeaderCarouselScroll}
          >
            <Animated.FlatList
              ref={flatListRef}
              style={{ width }}
              data={photos}
              numColumns={4}
              contentContainerStyle={{ gap: 2 }}
              columnWrapperStyle={{ gap: 2 }}
              scrollEnabled={flatListScrollEnabled}
              inverted
              onScroll={onFlatListScroll}
              renderItem={({ item }) => (
                <Link href={`/photo/${item.id}`} asChild>
                  <Pressable style={{ width: `${100 / 4}%`, aspectRatio: 1 }}>
                    <Image
                      source={item.image}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </Pressable>
                </Link>
              )}
            />

            <View
              style={{
                width,
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <Animated.Image
                source={photos[1].image}
                style={[
                  {
                    width: width,
                    height: '100%',
                  },
                  animatedStyle,
                ]}
                resizeMode="cover"
              />
            </View>

            <View style={{ width, height: '100%', overflow: 'hidden' }}>
              <Animated.Image
                source={photos[10].image}
                style={[
                  {
                    width: width,
                    height: '100%',
                  },
                  animatedStyle,
                ]}
                resizeMode="cover"
              />
            </View>
          </ScrollView>
        </Animated.View>

        <View
          style={{
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 5,
          }}
        >
          {Array(3)
            .fill(0)
            .map((item, index) => (
              <View
                key={index}
                style={{
                  width: index === headerCarouselPage ? 10 : 8,
                  aspectRatio: 1,
                  backgroundColor:
                    index === headerCarouselPage ? 'black' : 'gray',
                  borderRadius: 5,
                }}
              />
            ))}
        </View>

        <Carousel title="Albums" photos={photos.slice(0, 6)} />
        <Carousel title="People" photos={photos.slice(3, 6)} />
        <Carousel title="Featured" photos={photos.slice(6, 10)} />

        <StatusBar style="auto" />
      </Animated.ScrollView>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
