import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://10.156.234.139:8000/api/transaksi-detail/${id}`)
      .then(res => { setOrder(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [id]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="white" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Pesanan</Text>
        <View style={{width:24}} />
      </View>

      {loading ? (
        <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size="large" color="#00A896" /></View>
      ) : order ? (
        <ScrollView style={{padding: 20}}>
          <View style={styles.card}>
            <Text style={styles.invNo}>Invoice #{order.id}</Text>
            <Text style={styles.date}>{new Date(order.created_at).toLocaleString()}</Text>
            <View style={styles.divider} />

            {(typeof order.items === 'string' ? JSON.parse(order.items) : order.items).map((item: any, index: number) => (
              <View key={index} style={styles.itemRow}>
                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQty}>{item.quantity} x Rp {parseFloat(item.price).toLocaleString()}</Text>
                </View>
                <Text style={styles.itemSubtotal}>Rp {(item.quantity * item.price).toLocaleString()}</Text>
              </View>
            ))}

            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.totalLabel}>Total Bayar:</Text>
              <Text style={styles.totalValue}>Rp {parseFloat(order.total_harga).toLocaleString()}</Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Data tidak ditemukan</Text></View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#00A896', padding: 20, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 3 },
  invNo: { fontSize: 18, fontWeight: 'bold' },
  date: { color: '#999', marginBottom: 15 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 15 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  itemName: { fontWeight: 'bold', fontSize: 15 },
  itemQty: { color: '#666', fontSize: 12 },
  itemSubtotal: { fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: '#00A896' }
});