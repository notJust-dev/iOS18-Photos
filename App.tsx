import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import { photos } from './data';

export default function App() {
  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        numColumns={4}
        contentContainerStyle={{ gap: 2 }}
        columnWrapperStyle={{ gap: 2 }}
        renderItem={({ item }) => (
          <Image
            source={item.image}
            style={{ width: `${100 / 4}%`, aspectRatio: 1 }}
          />
        )}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
