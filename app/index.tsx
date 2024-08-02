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
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function App() {
  const { height, width } = useWindowDimensions();
  const [headerCarouselPage, setHeaderCarouselPage] = useState(0);

  const scale = useSharedValue(1.2);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    scale.value = 1.2;
    scale.value = withTiming(1, { duration: 6000 });
  }, [headerCarouselPage]);

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

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <ScrollView
        horizontal
        style={{ height: height / 2 }}
        snapToInterval={width}
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={onHeaderCarouselScroll}
      >
        <FlatList
          style={{ width }}
          data={photos}
          numColumns={4}
          contentContainerStyle={{ gap: 2 }}
          columnWrapperStyle={{ gap: 2 }}
          scrollEnabled={false}
          inverted
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

        <View style={{ width, height: '100%', overflow: 'hidden' }}>
          <Animated.Image
            source={photos[0].image}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
