import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore'; // Pastikan path store benar

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user); // Mengambil data user yang sedang login
  const logout = useAuthStore((state) => state.logout); // Mengambil fungsi logout

  // Fungsi Logout Asli
  const handleLogout = () => {
    Alert.alert("Konfirmasi", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      { 
        text: "Ya, Keluar", 
        onPress: () => {
          logout(); // Hapus data user dari memori HP
          router.replace('/(auth)/login' as any); // Balik ke halaman login
        } 
      }
    ]);
  };

  // Komponen Menu yang bisa diklik
  const MenuItem = ({ icon, title, color = '#555', onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.menuText}>{title}</Text>
      <Ionicons name="chevron-forward" size={18} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* 1. HEADER (DINAMIS SESUAI USER LOGIN) */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={{ fontSize: 40 }}>{user?.name ? user.name.charAt(0).toUpperCase() : '👤'}</Text>
        </View>
        <Text style={styles.name}>{user?.name || 'Immanuel Tampubolon'}</Text>
        <Text style={styles.email}>{user?.email || 'user@email.com'}</Text>
      </View>

      {/* 2. SECTION ACCOUNT */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <MenuItem 
    icon="person-outline" 
    title="Edit Profile" 
    color="#00A896" 
    onPress={() => router.push('/profile/edit' as any)} // <--- SEKARANG JALAN KE HALAMAN EDIT
/>
        <MenuItem 
    icon="location-outline" 
    title="My Address" 
    color="#2196F3" 
    onPress={() => router.push('/profile/address' as any)} // <--- SEKARANG JALAN
/>
        <MenuItem 
    icon="card-outline" 
    title="Payment Methods" 
    color="#9C27B0" 
    onPress={() => router.push('/profile/payments' as any)} 
/>
      </View>

      {/* 3. SECTION ORDERS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Orders</Text>
        <MenuItem 
            icon="cart-outline" 
            title="My Orders" 
            color="#FF9800" 
            onPress={() => router.push('/(tabs)/orders' as any)} // Pindah ke tab Riwayat Pesanan
        />
       <MenuItem 
    icon="heart-outline" 
    title="Wishlist" 
    color="#F44336" 
    onPress={() => router.push('/profile/wishlist' as any)} 
/>
      </View>

      {/* 4. SECTION SUPPORT */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <MenuItem 
    icon="help-circle-outline" 
    title="Help & FAQ" 
    color="#607D8B" 
    onPress={() => router.push('/profile/help' as any)} // <--- SEKARANG JALAN
/>
        <MenuItem 
    icon="document-text-outline" 
    title="Privacy Policy" 
    color="#607D8B" 
    onPress={() => router.push('/profile/privacy' as any)} 
/>
      </View>

      {/* 5. TOMBOL LOGOUT */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="white" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#00A896', paddingTop: 80, paddingBottom: 35, alignItems: 'center' },
  avatarCircle: { width: 90, height: 90, backgroundColor: 'white', borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 12, elevation: 3 },
  name: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  email: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 },
  section: { backgroundColor: 'white', marginHorizontal: 15, marginTop: 15, borderRadius: 15, padding: 5, elevation: 2 },
  sectionTitle: { fontSize: 13, color: '#999', fontWeight: '600', paddingHorizontal: 15, paddingTop: 12, paddingBottom: 5, textTransform: 'uppercase' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  menuIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuText: { flex: 1, fontSize: 15, color: '#333' },
  logoutBtn: { backgroundColor: '#FF5252', margin: 15, padding: 18, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  logoutText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});