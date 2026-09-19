import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  ActivityIndicator, RefreshControl, StatusBar, Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const { width } = Dimensions.get('window');

export default function AdminDashboard() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://10.156.234.139:8000/api/admin/stats');
      setStats(res.data);
    } catch (e) {
      console.log("Gagal ambil statistik:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color, sub }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statSub}>{sub}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Executive Panel</Text>
          <TouchableOpacity onPress={fetchStats}>
            <Ionicons name="refresh-circle" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSub}>Apotek Century Management</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchStats} />}
      >
        <View style={{ padding: 20 }}>
          
          <StatCard 
            title="TOTAL PENDAPATAN" 
            value={`Rp ${(stats?.pendapatan || 0).toLocaleString()}`} 
            icon="cash" 
            color="#4CAF50" 
            sub="Uang masuk dari QRIS"
          />

          <View style={styles.rowBetween}>
            <View style={{ width: '48%' }}>
              <StatCard title="PESANAN" value={stats?.pesanan || 0} icon="cart" color="#2196F3" sub="Transaksi" />
            </View>
            <View style={{ width: '48%' }}>
              <StatCard title="RESEP" value={stats?.resep_pending || 0} icon="document-text" color="#FF9800" sub="Belum cek" />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.statCard, { borderLeftColor: '#F44336', backgroundColor: '#FFF5F5' }]}
            onPress={() => router.push('/admin/manage-stock' as any)}
          >
            <Ionicons name="warning" size={30} color="#F44336" />
            <View style={{ marginLeft: 15 }}>
              <Text style={[styles.statTitle, { color: '#F44336' }]}>STOK MAU HABIS</Text>
              <Text style={styles.statValue}>{stats?.stok_kritis || 0} Produk</Text>
              <Text style={{ fontSize: 11, color: '#666' }}>Ketuk untuk kelola stok</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.menuHeader}>Manajemen Toko</Text>

          <View style={styles.menuGrid}>
            <TouchableOpacity style={styles.menuBtn} onPress={() => router.push('/admin/add-obat' as any)}>
              <View style={[styles.menuIconBox, { backgroundColor: '#E0F2F1' }]}>
                <Ionicons name="add-circle" size={30} color="#00A896" />
              </View>
              <Text style={styles.menuText}>Tambah Obat</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBtn} onPress={() => router.push('/admin/manage-stock' as any)}>
              <View style={[styles.menuIconBox, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="cube" size={30} color="#FF9800" />
              </View>
              <Text style={styles.menuText}>Kelola Stok</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBtn} onPress={() => router.push('/admin/manage-orders' as any)}>
              <View style={[styles.menuIconBox, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="receipt" size={30} color="#2196F3" />
              </View>
              <Text style={styles.menuText}>Daftar Pesanan</Text>
            </TouchableOpacity>

            {/* TAMBAH ARTIKEL */}
            <TouchableOpacity style={styles.menuBtn} onPress={() => router.push('/admin/add-article' as any)}>
              <View style={[styles.menuIconBox, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="newspaper" size={30} color="#9C27B0" />
              </View>
              <Text style={styles.menuText}>Tambah Artikel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuBtn} onPress={() => router.push('/admin/manage-articles' as any)}>
  <View style={[styles.menuIconBox, { backgroundColor: '#FCE4EC' }]}>
    <Ionicons name="newspaper-outline" size={30} color="#E91E63" />
  </View>
  <Text style={styles.menuText}>Kelola Artikel</Text>
</TouchableOpacity>

            <TouchableOpacity style={[styles.menuBtn, { width: '100%' }]} onPress={() => {
               logout();
               router.replace('/(auth)/login');
            }}>
              <View style={[styles.menuIconBox, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name="log-out" size={30} color="#F44336" />
              </View>
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    backgroundColor: '#00A896', 
    paddingTop: 60, 
    paddingBottom: 30, 
    paddingHorizontal: 20, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30,
    elevation: 10
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.7)', marginTop: 5, fontSize: 13 },
  statCard: { 
    backgroundColor: 'white', padding: 18, borderRadius: 15, 
    flexDirection: 'row', alignItems: 'center', marginBottom: 15, 
    elevation: 3, borderLeftWidth: 6 
  },
  iconCircle: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
  statTitle: { fontSize: 11, color: '#999', fontWeight: 'bold', textTransform: 'uppercase' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#333', marginVertical: 2 },
  statSub: { fontSize: 10, color: '#AAA' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  menuHeader: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 10, marginBottom: 15 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  menuBtn: { 
    backgroundColor: 'white', width: '48%', padding: 20, borderRadius: 20, 
    alignItems: 'center', marginBottom: 15, elevation: 2 
  },
  menuIconBox: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  menuText: { fontSize: 13, fontWeight: '700', color: '#444' }
});