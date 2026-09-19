import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

export default function WishlistScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`http://10.156.234.139:8000/api/wishlist/${user.id}`);
      setItems(res.data);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  const removeWish = async (id: number) => {
    try {
      await axios.delete(`http://10.156.234.139:8000/api/wishlist/${id}`);
      fetchWishlist();
    } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchWishlist(); }, []);

  if (loading) return <ActivityIndicator size="large" color="#00A896" style={{flex:1}} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist</Text>
        <View style={{width:24}} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push({ pathname: '/obat/[id]', params: { id: item.obat.id } } as any)}
          >
            <Image source={{ uri: item.obat.foto }} style={styles.image} />
            <View style={{flex:1, marginLeft: 15}}>
              <Text style={styles.name}>{item.obat.nama}</Text>
              <Text style={styles.price}>Rp {parseFloat(item.obat.harga).toLocaleString()}</Text>
            </View>
            <TouchableOpacity onPress={() => removeWish(item.id)}>
              <Ionicons name="heart" size={28} color="#F44336" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{textAlign:'center', marginTop: 50, color:'#999'}}>Belum ada obat favorit.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingTop: 60, padding: 20, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#EEE' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  card: { flexDirection: 'row', backgroundColor: 'white', marginHorizontal: 15, marginTop: 10, padding: 15, borderRadius: 12, elevation: 2, alignItems: 'center' },
  image: { width: 60, height: 60, borderRadius: 8, resizeMode: 'contain' },
  name: { fontSize: 15, fontWeight: 'bold' },
  price: { color: '#00A896', marginTop: 5 }
});