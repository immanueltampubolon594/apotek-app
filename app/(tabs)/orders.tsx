import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, 
  TouchableOpacity, ActivityIndicator, StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import Sidebar from '../../components/drawer/Sidebar';
import { API_URL, getImageUrl } from '../../config/api';

export default function MyOrdersScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const [activeTab, setActiveTab] = useState('UPCOMING');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const fetchOrders = async () => {
    // Kalau belum login, jangan panggil API sama sekali (ini yang mencegah 401 muncul di Home)
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/transaksi/${user.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setOrders(response.data);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        console.log('Sesi login sudah tidak valid, silakan login ulang.');
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const filteredOrders = orders.filter(item => {
    if (activeTab === 'UPCOMING') return item.status !== 'Selesai';
    return item.status === 'Selesai';
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => setSidebarVisible(true)}>
            <Ionicons name="menu" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Orders</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'UPCOMING' && styles.tabActive]}
            onPress={() => setActiveTab('UPCOMING')}
          >
            <Text style={[styles.tabText, activeTab === 'UPCOMING' && styles.tabTextActive]}>UPCOMING</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'PAST' && styles.tabActive]}
            onPress={() => setActiveTab('PAST')}
          >
            <Text style={[styles.tabText, activeTab === 'PAST' && styles.tabTextActive]}>PAST ORDERS</Text>
          </TouchableOpacity>
        </View>
      </View>

      {!user ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 }}>
          <Ionicons name="lock-closed-outline" size={50} color="#CCC" />
          <Text style={{ color: '#999', marginTop: 15, textAlign: 'center' }}>
            Silakan login untuk melihat pesanan kamu.
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: '#00A896', paddingHorizontal: 25, paddingVertical: 10, borderRadius: 20, marginTop: 15 }}
            onPress={() => router.push('/(auth)/login' as any)}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Login</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <ActivityIndicator size="large" color="#00A896" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <View style={styles.cardTop}>
                <Image
                  source={{ uri: getImageUrl(item.items[0]?.image) || 'https://via.placeholder.com/150' }}
                  style={styles.productImg}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>{item.items[0]?.name || 'Medicine'}</Text>
                  <Text style={styles.orderId}>Order ID: PQ{item.id}456</Text>
                  <Text style={styles.price}>Rp {parseFloat(item.total_harga).toLocaleString()}</Text>
                </View>
                <Ionicons name="ellipsis-vertical" size={20} color="#CCC" />
              </View>

              <View style={styles.divider} />

              <View style={styles.cardBottom}>
                <View>
                  <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
                  <Text style={[styles.statusText, { color: item.status === 'Selesai' ? '#00A896' : '#FF7043' }]}>
                    {item.status.toUpperCase()}
                  </Text>
                </View>
                
                <TouchableOpacity 
                    style={[styles.actionBtn, { backgroundColor: activeTab === 'UPCOMING' ? '#2E3E5C' : '#00A896' }]}
                    onPress={() => router.push({ pathname: '/orders/[id]', params: { id: item.id } } as any)}
                >
                  <Text style={styles.actionBtnText}>{activeTab === 'UPCOMING' ? 'Track' : 'Reorder'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 50, color: '#999' }}>No orders found.</Text>
          }
        />
      )}

      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#00A896', paddingTop: 60, paddingBottom: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  
  tabContainer: { flexDirection: 'row', marginTop: 25, paddingHorizontal: 20 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
  tabActive: { backgroundColor: 'white', borderColor: 'white' },
  tabText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  tabTextActive: { color: '#00A896' },

  orderCard: { backgroundColor: 'white', borderRadius: 15, padding: 18, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  productImg: { width: 60, height: 60, borderRadius: 10, resizeMode: 'contain' },
  productInfo: { flex: 1, marginLeft: 15 },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  orderId: { fontSize: 12, color: '#999', marginVertical: 4 },
  price: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 15 },
  
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  statusText: { fontSize: 11, fontWeight: 'bold', marginTop: 2 },
  
  actionBtn: { paddingHorizontal: 25, paddingVertical: 8, borderRadius: 20 },
  actionBtnText: { color: 'white', fontWeight: 'bold', fontSize: 12 }
});