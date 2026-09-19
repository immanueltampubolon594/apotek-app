import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function ArticleDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data detail artikel dari Laravel
    axios.get(`http://10.156.234.139:8000/api/articles/${id}`)
      .then(res => {
        setArticle(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <ActivityIndicator size="large" color="#00A896" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      {/* Tombol Back */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: article?.image }} style={styles.mainImg} />
        
        <View style={styles.contentBox}>
          <Text style={styles.category}>{article?.category}</Text>
          <Text style={styles.title}>{article?.title}</Text>

          <View style={styles.authorRow}>
            <Image source={{ uri: article?.author_avatar }} style={styles.avatar} />
            <View>
                <Text style={styles.authorName}>{article?.author_name}</Text>
                <Text style={styles.authorRole}>{article?.author_role}</Text>
            </View>
            <Text style={styles.date}>18 Jun 2026</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.contentText}>
            Pentingnya menjaga kesehatan di masa sekarang sangat krusial. Artikel ini membahas secara mendalam mengenai {article?.title.toLowerCase()}. 
            {"\n\n"}
            Menjaga pola makan yang sehat dan rutin berolahraga adalah kunci utama. Selain itu, pastikan Anda mengonsumsi vitamin yang cukup dan berkonsultasi dengan tenaga medis profesional jika merasa kurang sehat.
            {"\n\n"}
            Jangan lupa untuk selalu mencuci tangan dan menjaga kebersihan lingkungan sekitar Anda agar terhindar dari berbagai macam penyakit yang tidak diinginkan.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  backBtn: { position: 'absolute', top: 50, left: 20, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 20 },
  mainImg: { width: '100%', height: 300 },
  contentBox: { padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, backgroundColor: 'white' },
  category: { color: '#00A896', fontWeight: 'bold', fontSize: 14, textTransform: 'uppercase' },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 10, color: '#333' },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  authorName: { fontWeight: 'bold', fontSize: 14 },
  authorRole: { fontSize: 12, color: '#999' },
  date: { marginLeft: 'auto', color: '#999', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 20 },
  contentText: { fontSize: 16, color: '#444', lineHeight: 26, textAlign: 'justify' }
});