import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

export default function AddressScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Tambah Alamat Baru
  const [label, setLabel] = useState('');
  const [alamat, setAlamat] = useState('');

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`http://10.156.234.139:8000/api/alamat/${user.id}`);
      setAddresses(res.data);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!label || !alamat) return Alert.alert("Error", "Isi semua kolom");
    try {
      await axios.post('http://10.156.234.139:8000/api/alamat', {
        user_id: user.id,
        label: label,
        alamat_lengkap: alamat
      });
      setLabel(''); setAlamat('');
      fetchAddresses();
      Alert.alert("Sukses", "Alamat berhasil ditambah!");
    } catch (e) { Alert.alert("Gagal", "Koneksi bermasalah"); }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://10.156.234.139:8000/api/alamat/${id}`);
      fetchAddresses();
    } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchAddresses(); }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
        <Text style={styles.headerTitle}>My Address</Text>
        <View style={{width:24}} />
      </View>

      <View style={styles.addForm}>
        <TextInput placeholder="Label (Rumah/Kantor)" style={styles.input} value={label} onChangeText={setLabel} />
        <TextInput placeholder="Alamat Lengkap" style={styles.input} value={alamat} onChangeText={setAlamat} />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}><Text style={{color:'white'}}>Tambah Alamat</Text></TouchableOpacity>
      </View>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{flex:1}}>
              <Text style={{fontWeight:'bold', color:'#00A896'}}>{item.label}</Text>
              <Text style={{color:'#666'}}>{item.alamat_lengkap}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingTop: 60, padding: 20, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#EEE' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  addForm: { padding: 20, backgroundColor: 'white', marginBottom: 10 },
  input: { borderBottomWidth: 1, borderColor: '#DDD', padding: 8, marginBottom: 15 },
  addBtn: { backgroundColor: '#00A896', padding: 12, borderRadius: 10, alignItems: 'center' },
  card: { flexDirection: 'row', backgroundColor: 'white', marginHorizontal: 15, marginTop: 10, padding: 15, borderRadius: 12, elevation: 2, alignItems: 'center' }
});