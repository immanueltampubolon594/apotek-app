import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 20;

const ALL_CATEGORIES = [
  { id: '1', name: "Women's Health", icon: 'woman-outline' },
  { id: '2', name: 'Skin & Hair', icon: 'person-outline' },
  { id: '3', name: 'Child Specialist', icon: 'happy-outline' },
  { id: '4', name: 'Lungs and Breathing', icon: 'fitness-outline' },
  { id: '5', name: 'Dental Care', icon: 'medical-outline' },
  { id: '6', name: 'Ear Nose Throat', icon: 'ear-outline' },
  { id: '7', name: 'Homeopathy', icon: 'flask-outline' },
  { id: '8', name: 'Bone and Joints', icon: 'body-outline' },
  { id: '9', name: 'Sex Specialist', icon: 'male-female-outline' },
  { id: '10', name: 'Eye Specialist', icon: 'eye-outline' },
  { id: '11', name: 'Digestive Issues', icon: 'restaurant-outline' },
  { id: '12', name: 'Mental Wellness', icon: 'pulse-outline' },
  { id: '13', name: 'Heart', icon: 'heart-outline' },
  { id: '14', name: 'Diabetes Management', icon: 'water-outline' },
  { id: '15', name: 'Brain and Nerves', icon: 'infinite-outline' },
  { id: '16', name: 'Urinary Issues', icon: 'beaker-outline' },
  { id: '17', name: 'Kidney Issues', icon: 'medkit-outline' },
  { id: '18', name: 'Ayurveda', icon: 'leaf-outline' },
  { id: '19', name: 'Vitamins', icon: 'medkit-outline' },
  { id: '20', name: 'Wellness', icon: 'heart-circle-outline' },
];

export default function AllCategoriesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Categories</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={{marginRight: 15}}>
            <Ionicons name="list" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="grid" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* GRID KATEGORI */}
      <FlatList
        data={ALL_CATEGORIES}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.catCard}
            onPress={() => router.push({
              pathname: '/(tabs)/two',
              params: { category: item.name }
            } as any)}
          >
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon as any} size={22} color="white" />
            </View>
            <Text style={styles.catName} numberOfLines={2}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    backgroundColor: '#00A896',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row' },
  listContainer: { padding: 10, paddingBottom: 30 },
  catCard: {
    backgroundColor: 'white',
    width: cardWidth,
    margin: 5,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00A896',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  catName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#444'
  }
});