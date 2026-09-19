import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, 
  TouchableOpacity, ActivityIndicator, Alert, StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

const API = 'http://10.156.234.139:8000/api';

export default function ManageArticles() {
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/articles`);
      setArticles(res.data);
    } catch (e) {
      console.log('Gagal ambil artikel:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = (id: number, title: string) => {
    Alert.alert(
      'Hapus Artikel',
      `Yakin ingin menghapus "${title}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API}/articles/${id}`);
              setArticles(prev => prev.filter(a => a.id !== id));
              Alert.alert('Berhasil', 'Artikel berhasil dihapus');
            } catch (e) {
              Alert.alert('Gagal', 'Tidak bisa menghapus artikel');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.img} />
      <View style={styles.info}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.category}</Text>
          </View>
          {item.is_top === 1 && (
            <View style={[styles.badge, { backgroundColor: '#FFF3E0' }]}>
              <Text style={[styles.badgeText, { color: '#FF9800' }]}>Top</Text>
            </View>
          )}
        </View>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.author}>{item.author_name}</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteBtn}
        onPress={() => handleDelete(item.id, item.title)}
      >
        <Ionicons name="trash" size={20} color="#F44336" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kelola Artikel</Text>
        <TouchableOpacity onPress={() => router.push('/admin/add-article' as any)}>
          <Ionicons name="add-circle" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00A896" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="document-text-outline" size={60} color="#DDD" />
              <Text style={styles.emptyText}>Belum ada artikel</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    backgroundColor: '#00A896',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    elevation: 2,
  },
  img: { width: 70, height: 70, borderRadius: 10 },
  info: { flex: 1, marginLeft: 12 },
  badgeRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  badge: {
    backgroundColor: '#E0F2F1',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 10, color: '#00A896', fontWeight: 'bold' },
  title: { fontSize: 13, fontWeight: 'bold', color: '#333', marginBottom: 3 },
  author: { fontSize: 11, color: '#999' },
  deleteBtn: {
    padding: 8,
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    marginLeft: 8,
  },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#AAA', marginTop: 10, fontSize: 15 },
});