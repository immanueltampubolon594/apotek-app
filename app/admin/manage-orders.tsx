import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ORDERS = [
  { id: 'ORD001', items: 'Paracetamol, Vitamin C', total: '$24.50', status: 'Delivered', date: '12 Jun 2026', color: '#4CAF50' },
  { id: 'ORD002', items: 'Dabur Chyawanprash', total: '$72.00', status: 'On the way', date: '14 Jun 2026', color: '#FF9800' },
  { id: 'ORD003', items: 'Seven Seas Original', total: '$39.00', status: 'Processing', date: '15 Jun 2026', color: '#2196F3' },
];

export default function PesananScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{width: 24}} />
      </View>
      <FlatList
        data={ORDERS}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.orderId}>#{item.id}</Text>
              <View style={[styles.badge, { backgroundColor: item.color + '20' }]}>
                <Text style={[styles.badgeText, { color: item.color }]}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.items}>{item.items}</Text>
            <View style={styles.cardBottom}>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.total}>{item.total}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#00A896', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  card: { backgroundColor: 'white', borderRadius: 15, padding: 18, marginBottom: 12, elevation: 2 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  orderId: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  items: { fontSize: 13, color: '#666', marginBottom: 10 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  date: { fontSize: 12, color: '#999' },
  total: { fontSize: 15, fontWeight: 'bold', color: '#00A896' },
});