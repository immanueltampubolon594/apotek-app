import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

export default function Sidebar({ visible, onClose }: SidebarProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // LOGIKA: Cek apakah user adalah admin berdasarkan nama
  const isAdmin = user?.name?.toLowerCase().includes('admin');

  const navigateTo = (path: string) => {
    onClose();
    router.push(path as any);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Apakah anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      { text: "Ya, Keluar", onPress: () => {
          logout();
          onClose();
          router.replace('/(auth)/login' as any);
      }}
    ]);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          
          {/* 1. HEADER PROFIL (DINAMIS) */}
          <View style={styles.header}>
            <View style={styles.profileRow}>
              <Image 
                source={{ uri: 'https://i.pravatar.cc/150?u=' + (user?.id || '1') }} 
                style={styles.avatar} 
              />
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{user?.name || 'User'}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={12} color="white" />
                  <Text style={styles.locationText}>Jakarta, Indonesia</Text>
                </View>
              </View>
              <View style={styles.qrCode}>
                <Ionicons name="qr-code-outline" size={24} color="white" />
              </View>
            </View>
          </View>

          {/* 2. DAFTAR MENU */}
          <ScrollView style={styles.menuList}>
            
            {/* --- MENU KHUSUS ADMIN (HANYA MUNCUL JIKA USER ADMIN) --- */}
            {isAdmin && (
              <TouchableOpacity 
                style={[styles.menuItem, styles.adminMenuHighlight]} 
                onPress={() => navigateTo('/admin/dashboard')}
              >
                <Ionicons name="shield-checkmark" size={24} color="#00A896" />
                <Text style={[styles.menuText, {color: '#00A896', fontWeight: 'bold'}]}>Admin Panel</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/(tabs)/two')}>
              <Ionicons name="add-circle-outline" size={24} color="#555" />
              <Text style={styles.menuText}>Shop By Medicine</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/profile/my-reseps')}>
              <Ionicons name="clipboard-outline" size={24} color="#555" />
              <Text style={styles.menuText}>My Prescriptions</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/obat/categories')}>
              <Ionicons name="medkit-outline" size={24} color="#555" />
              <Text style={styles.menuText}>OTC & Wellness</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/(tabs)/orders')}>
              <Ionicons name="cart-outline" size={24} color="#555" />
              <Text style={styles.menuText}>My Order</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/(tabs)/profile')}>
              <Ionicons name="person-outline" size={24} color="#555" />
              <Text style={styles.menuText}>My Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Promo", "Belum ada diskon tersedia.")}>
              <Ionicons name="pricetag-outline" size={24} color="#555" />
              <Text style={styles.menuText}>Offers & Discounts</Text>
            </TouchableOpacity>

            <View style={{height: 1, backgroundColor: '#F0F0F0', marginVertical: 10}} />

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#FF7043" />
              <Text style={[styles.menuText, {color: '#FF7043', fontWeight: 'bold'}]}>Log out</Text>
            </TouchableOpacity>

            {/* MENU BARU: AI DRUG CHECKER */}
            <TouchableOpacity 
              style={[styles.menuItem, { backgroundColor: '#F0F9F8', borderRadius: 10 }]} 
              onPress={() => navigateTo('/ai/interaksi')}
            >
             <Ionicons name="hardware-chip-outline" size={24} color="#00A896" />
              <Text style={[styles.menuText, { color: '#00A896', fontWeight: 'bold' }]}>AI Drug Checker</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* 3. FOOTER */}
          <View style={styles.footer}>
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png' }} style={{width: 30, height: 30, marginRight: 10}} />
            <View>
              <Text style={{fontWeight:'bold', color: '#333'}}>Pharmacy App</Text>
              <Text style={{fontSize:10, color:'#999'}}>Version 2.0.5</Text>
            </View>
          </View>
        </View>

        {/* Area klik di luar untuk tutup */}
        <TouchableOpacity style={styles.dimArea} onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, flexDirection: 'row' },
  container: { width: '80%', backgroundColor: 'white', height: '100%', elevation: 10 },
  dimArea: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  header: { backgroundColor: '#00A896', padding: 25, paddingTop: 60 },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 55, height: 55, borderRadius: 28, borderWidth: 2, borderColor: 'white' },
  profileInfo: { marginLeft: 15, flex: 1 },
  userName: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { color: 'white', fontSize: 11, marginLeft: 4 },
  qrCode: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 8 },
  menuList: { padding: 15 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10, borderRadius: 10 },
  adminMenuHighlight: { backgroundColor: '#E0F2F1', marginBottom: 10 }, // Warna hijau muda untuk membedakan menu admin
  menuText: { marginLeft: 20, fontSize: 15, color: '#444', fontWeight: '500' },
  footer: { padding: 25, borderTopWidth: 1, borderTopColor: '#EEE', flexDirection: 'row', alignItems: 'center' }
});