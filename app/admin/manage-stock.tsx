import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function ManageStockScreen() {
  const router = useRouter();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchObat = async () => {
    try {
      // GANTI IP sesuai laptopmu
      const res = await axios.get('http://10.156.234.139:8000/api/obat');
      setMedicines(res.data);
    } catch (e) { 
      console.log("Fetch Error:", e); 
    } finally { 
      setLoading(false); 
    }
  };

  const confirmDelete = (id: number, nama: string) => {
    Alert.alert(
      "Hapus Obat",
      `Apakah Anda yakin ingin menghapus ${nama}?`,
      [
        { text: "Batal", style: "cancel" },
        { text: "Hapus", style: "destructive", onPress: () => handleDelete(id) }
      ]
    );
  };

  const handleDelete = async (id: number) => {
    try {
      // PERHATIKAN: Sekarang gue pake tanda BACKTICK ( ` ) di bawah ini!
      const res = await axios.delete(`http://10.156.234.139:8000/api/obat/${id}`);
      
      if (res.status === 200) {
        Alert.alert("Sukses", "Obat berhasil dihapus!");
        fetchObat(); // Refresh daftar agar obat yang dihapus hilang
      }
    } catch (error: any) {
      // Munculkan error asli dari Laravel di terminal laptop buat ngecek
      console.log("Error Detail:", error.response?.data);
      const msg = error.response?.data?.message || "Gagal menghapus obat dari server.";
      Alert.alert("Gagal", msg);
    }
  };

  useEffect(() => { fetchObat(); }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="white" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Kelola Stok Obat</Text>
        <TouchableOpacity onPress={fetchObat}><Ionicons name="refresh" size={22} color="white" /></TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00A896" style={{flex:1}} />
      ) : (
        <FlatList
          data={medicines}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 15 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.foto }} style={styles.img} />
              <View style={{flex: 1, marginLeft: 15}}>
                <Text style={styles.name}>{item.nama}</Text>
                <Text style={styles.stock}>Stok: {item.stok} unit</Text>
                <Text style={styles.price}>Rp {parseFloat(item.harga).toLocaleString()}</Text>
              </View>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item.id, item.nama)}>
                <Ionicons name="trash-outline" size={24} color="#FF5252" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={{textAlign:'center', marginTop:50, color:'#999'}}>Tidak ada obat di gudang.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#2E3E5C', paddingTop: 60, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  card: { flexDirection: 'row', backgroundColor: 'white', padding: 15, borderRadius: 15, marginBottom: 10, elevation: 3, alignItems: 'center' },
  img: { width: 55, height: 55, borderRadius: 8, resizeMode: 'contain', backgroundColor: '#F5F5F5' },
  name: { fontWeight: 'bold', fontSize: 15, color: '#333' },
  stock: { color: '#666', fontSize: 12, marginTop: 2 },
  price: { color: '#00A896', fontWeight: 'bold', marginTop: 2 },
  deleteBtn: { padding: 10, backgroundColor: '#FFF5F5', borderRadius: 10 }
});