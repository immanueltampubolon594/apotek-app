import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function HelpScreen() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    axios.get('http://10.156.234.139:8000/api/faqs') // Ganti IP Laptopmu
      .then(res => { setFaqs(res.data); setLoading(false); })
      .catch(err => { console.log(err); setLoading(false); });
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="black" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Help & FAQ</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00A896" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView style={{ padding: 20 }}>
          <Text style={styles.subTitle}>Pertanyaan Populer</Text>
          
          {faqs.map((item) => (
            <View key={item.id} style={styles.faqCard}>
              <TouchableOpacity style={styles.faqHeader} onPress={() => toggleExpand(item.id)}>
                <Text style={styles.question}>{item.pertanyaan}</Text>
                <Ionicons 
                  name={expandedId === item.id ? "chevron-up" : "chevron-down"} 
                  size={20} color="#999" 
                />
              </TouchableOpacity>
              
              {expandedId === item.id && (
                <View style={styles.faqBody}>
                  <Text style={styles.answer}>{item.jawaban}</Text>
                </View>
              )}
            </View>
          ))}

          <View style={styles.contactBox}>
            <Text style={styles.contactText}>Masih butuh bantuan?</Text>
            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="logo-whatsapp" size={20} color="white" />
              <Text style={styles.contactBtnText}>Chat Customer Service</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingTop: 60, padding: 20, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#EEE', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  subTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  faqCard: { backgroundColor: 'white', borderRadius: 12, marginBottom: 10, overflow: 'hidden', elevation: 2 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 18, alignItems: 'center' },
  question: { fontSize: 14, fontWeight: '600', color: '#444', flex: 1, marginRight: 10 },
  faqBody: { padding: 18, paddingTop: 0, borderTopWidth: 1, borderTopColor: '#F5F5F5' },
  answer: { fontSize: 14, color: '#666', lineHeight: 22 },
  contactBox: { marginTop: 30, alignItems: 'center', paddingBottom: 50 },
  contactText: { color: '#999', marginBottom: 15 },
  contactBtn: { backgroundColor: '#00A896', flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 30, alignItems: 'center' },
  contactBtnText: { color: 'white', fontWeight: 'bold', marginLeft: 10 }
});