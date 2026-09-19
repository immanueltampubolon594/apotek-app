import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  Alert, ActivityIndicator, Image, ScrollView, StatusBar 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AddObatScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // --- DATA FORM ---
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [hargaAsli, setHargaAsli] = useState(''); // opsional, buat diskon
  const [stok, setStok] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [image, setImage] = useState<any>(null);

  // --- DATA KATEGORI ---
  const [kategoris, setKategoris] = useState<any[]>([]);
  const [selectedKategori, setSelectedKategori] = useState<number | null>(null);

  // 1. Ambil data kategori dari Laravel saat halaman dibuka
  useEffect(() => {
    // GANTI IP sesuai laptopmu
    axios.get('http://10.156.234.139:8000/api/kategori-list')
      .then(res => setKategoris(res.data))
      .catch(e => console.log("Gagal ambil kategori", e));
  }, []);

  // 2. Fungsi Pilih Gambar
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // 3. Fungsi Simpan ke Database
  const handleSimpan = async () => {
    if (!nama || !harga || !stok || !selectedKategori || !image) {
      return Alert.alert("Peringatan", "Harap isi semua kolom, pilih kategori, dan upload foto!");
    }

    // Validasi ringan di frontend: kalau harga_asli diisi, harus lebih besar dari harga jual
    if (hargaAsli && parseFloat(hargaAsli) <= parseFloat(harga)) {
      return Alert.alert("Peringatan", "Harga Coret (harga asli) harus lebih besar dari Harga Jual.");
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('harga', harga);
    if (hargaAsli) {
      formData.append('harga_asli', hargaAsli); // dikirim hanya kalau diisi
    }
    formData.append('stok', stok);
    formData.append('deskripsi', deskripsi);
    formData.append('kategori_id', selectedKategori.toString());

    // Membungkus file gambar
    // @ts-ignore
    formData.append('image', {
      uri: image.uri,
      name: 'produk.jpg',
      type: 'image/jpeg',
    });

    try {
      await axios.post('http://10.156.234.139:8000/api/obat-admin', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Alert.alert("Sukses", "Obat baru berhasil ditambahkan!");
      router.back();
    } catch (e) {
      Alert.alert("Gagal", "Server bermasalah, coba cek koneksi Laravel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
         <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#333" /></TouchableOpacity>
         <Text style={styles.headerTitle}>Input Data Obat</Text>
         <View style={{width:24}} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          
          {/* UPLOAD FOTO */}
          <Text style={styles.label}>Foto Produk</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image.uri }} style={styles.previewImage} />
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="image-outline" size={40} color="#CCC" />
                <Text style={{ color: '#AAA', marginTop: 8 }}>Ketuk untuk pilih foto</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* INPUT NAMA */}
          <Text style={styles.label}>Nama Obat</Text>
          <TextInput style={styles.input} placeholder="Masukkan nama obat" value={nama} onChangeText={setNama} />

          {/* INPUT HARGA & STOK */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: '48%' }}>
              <Text style={styles.label}>Harga Jual (Rp)</Text>
              <TextInput style={styles.input} placeholder="15000" keyboardType="numeric" value={harga} onChangeText={setHarga} />
            </View>
            <View style={{ width: '48%' }}>
              <Text style={styles.label}>Stok</Text>
              <TextInput style={styles.input} placeholder="100" keyboardType="numeric" value={stok} onChangeText={setStok} />
            </View>
          </View>

          {/* INPUT HARGA CORET (OPSIONAL, UNTUK DISKON) */}
          <Text style={styles.label}>Harga Coret / Asli (opsional)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Kosongkan jika tidak ada diskon" 
            keyboardType="numeric" 
            value={hargaAsli} 
            onChangeText={setHargaAsli} 
          />
          <Text style={styles.helperText}>
            Isi kolom ini hanya jika produk sedang diskon. Badge "Sale" dan harga coret di Home hanya akan muncul jika kolom ini diisi.
          </Text>

          {/* PILIHAN KATEGORI (CHIPS) */}
          <Text style={styles.label}>Kategori Obat</Text>
          {kategoris.length === 0 ? <Text style={{color:'#999', marginBottom:15}}>Memuat kategori...</Text> : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
              {kategoris.map((c) => (
                <TouchableOpacity 
                  key={c.id} 
                  style={[styles.catChip, selectedKategori === c.id && styles.catChipActive]} 
                  onPress={() => setSelectedKategori(c.id)}
                >
                  <Text style={[styles.catText, selectedKategori === c.id && {color: 'white'}]}>{c.nama}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* DESKRIPSI */}
          <Text style={styles.label}>Deskripsi Obat</Text>
          <TextInput 
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
            placeholder="Tulis kegunaan, dosis, dan efek samping..." 
            multiline value={deskripsi} onChangeText={setDeskripsi} 
          />

          {/* TOMBOL PUBLIKASI */}
          <TouchableOpacity 
            style={[styles.btn, loading && { backgroundColor: '#999' }]} 
            onPress={handleSimpan} 
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>PUBLIKASI OBAT</Text>}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 60, padding: 20, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#F0F0F0', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  form: { padding: 25 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 8, marginTop: 10 },
  helperText: { fontSize: 11, color: '#999', marginTop: -4, marginBottom: 10 },
  imagePicker: { width: '100%', height: 180, backgroundColor: '#F9F9F9', borderRadius: 15, borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#DDD', justifyContent: 'center', alignItems: 'center', marginBottom: 15, overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  input: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 15, marginBottom: 10, fontSize: 15, borderWidth: 1, borderColor: '#EEE' },
  catChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, backgroundColor: '#F0F0F0', marginRight: 10, borderWidth: 1, borderColor: '#E0E0E0' },
  catChipActive: { backgroundColor: '#00A896', borderColor: '#00A896' },
  catText: { fontSize: 12, color: '#666', fontWeight: 'bold' },
  btn: { backgroundColor: '#00A896', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 20 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});