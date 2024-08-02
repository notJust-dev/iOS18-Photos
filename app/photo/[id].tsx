import { Text, Image } from 'react-native';
import { photos } from '../../data';
import { useLocalSearchParams } from 'expo-router';

export default function PhotoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const photo = photos.find((p) => p.id === Number.parseInt(id));

  if (!photo) {
    return <Text>Photo not found</Text>;
  }

  return (
    <Image
      source={photo.image}
      style={{ width: '100%', height: '100%' }}
      resizeMode="contain"
    />
  );
}
