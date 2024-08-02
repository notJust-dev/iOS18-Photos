import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { photos } from './data';
import Carousel from './Carousel';

export default function App() {
  const { height, width } = useWindowDimensions();

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
