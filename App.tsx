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
} from 'react-native';
import { photos } from './data';
import Carousel from './Carousel';
import { useState } from 'react';

export default function App() {
  const { height, width } = useWindowDimensions();
  const [headerCarouselPage, setHeaderCarouselPage] = useState(0);

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
            <Image
              source={item.image}
              style={{ width: `${100 / 4}%`, aspectRatio: 1 }}
            />
          )}
        />
        <Image
          source={photos[0].image}
          style={{ width, height: '100%' }}
          resizeMode="cover"
        />
        <Image
          source={photos[10].image}
          style={{ width, height: '100%' }}
          resizeMode="cover"
        />
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
