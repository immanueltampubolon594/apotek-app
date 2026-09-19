import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator, Switch, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

const CATEGORIES = ['Healthy Eating', 'Eye', 'Vitamins', 'Dental', 'Diabetes'];

export default function AddArticleScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Healthy Eating');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [authorAvatar, setAuthorAvatar] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [isTop, setIsTop] = useState(false);

  const handleSubmit = async () => {
    if (!title || !authorName || !authorRole || !image || !content) {
      Alert.alert('Lengkapi Data', 'Semua field wajib diisi kecuali Author Avatar.');
      return;
    }

    try {
      setLoading(true);
      await axios.post('http://10.156.234.139:8000/api/articles-admin', {
        title,
        category,
        author_name: authorName,
        author_role: authorRole,
        author_avatar: authorAvatar || 'https://i.pravatar.cc/150?u=admin',
        image,
        content,
        is_top: isTop ? 1 : 0,
      });
      Alert.alert('Berhasil', 'Artikel berhasil dipublikasikan!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (e) {
      Alert.alert('Gagal', 'Gagal menyimpan artikel. Cek koneksi server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Artikel</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>

        {/* JUDUL */}
        <Text style={styles.label}>Judul Artikel *</Text>
        <TextInput style={styles.input} placeholder="Contoh: 5 Fruits To Boost Your Health" value={title} onChangeText={setTitle} />

        {/* KATEGORI */}
        <Text style={styles.label}>Kategori *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, category === cat && styles.catChipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.catChipText, category === cat && { color: 'white' }]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* AUTHOR */}
        <Text style={styles.label}>Nama Penulis *</Text>
        <TextInput style={styles.input} placeholder="Contoh: Dr. Budi Santoso" value={authorName} onChangeText={setAuthorName} />

        <Text style={styles.label}>Profesi Penulis *</Text>
        <TextInput style={styles.input} placeholder="Contoh: Dietitian / Nutritionist" value={authorRole} onChangeText={setAuthorRole} />

        <Text style={styles.label}>URL Foto Penulis (opsional)</Text>
        <TextInput style={styles.input} placeholder="https://i.pravatar.cc/150?u=1" value={authorAvatar} onChangeText={setAuthorAvatar} />

        {/* GAMBAR ARTIKEL */}
        <Text style={styles.label}>URL Gambar Artikel *</Text>
        <TextInput style={styles.input} placeholder="https://images.unsplash.com/..." value={image} onChangeText={setImage} />
        <Text style={styles.hint}>Gunakan link gambar dari Unsplash atau Google Images</Text>

        {/* ISI ARTIKEL */}
        <Text style={styles.label}>Isi Artikel *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Tulis isi artikel di sini..."
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
        />

        {/* TOP ARTICLE TOGGLE */}
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.label}>Tampilkan di Top Articles?</Text>
            <Text style={styles.hint}>Artikel akan muncul di bagian atas halaman</Text>
          </View>
          <Switch
            value={isTop}
            onValueChange={setIsTop}
            trackColor={{ false: '#DDD', true: '#00A896' }}
            thumbColor={isTop ? 'white' : '#f4f3f4'}
          />
        </View>

        {/* TOMBOL SUBMIT */}
        <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
          {loading
            ? <ActivityIndicator color="white" />
            : <Text style={styles.btnText}>PUBLIKASIKAN ARTIKEL</Text>
          }
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    backgroundColor: '#00A896', paddingTop: 60, paddingBottom: 20,
    paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  form: { padding: 20 },
  label: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 8, marginTop: 4 },
  hint: { fontSize: 11, color: '#999', marginBottom: 12, marginTop: -8 },
  input: {
    backgroundColor: 'white', borderRadius: 12, padding: 14,
    fontSize: 14, color: '#333', marginBottom: 16,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4
  },
  textArea: { height: 160, textAlignVertical: 'top' },
  catChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    backgroundColor: '#E0F2F1', marginRight: 10
  },
  catChipActive: { backgroundColor: '#00A896' },
  catChipText: { color: '#00A896', fontWeight: 'bold', fontSize: 13 },
  toggleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 24, elevation: 2
  },
  btn: {
    backgroundColor: '#9C27B0', padding: 18, borderRadius: 15,
    alignItems: 'center', elevation: 4
  },
  btnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});