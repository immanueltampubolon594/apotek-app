import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  const Section = ({ title, content }: { title: string; content: string }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdate}>Terakhir diperbarui: 18 Juni 2026</Text>

        <Section 
          title="1. Pengumpulan Data" 
          content="Kami mengumpulkan data pribadi Anda seperti nama, email, dan alamat pengiriman saat Anda mendaftar akun. Kami juga menyimpan riwayat pembelian obat Anda untuk keperluan medis." 
        />

        <Section 
          title="2. Keamanan Data" 
          content="Semua informasi yang Anda berikan disimpan di server yang aman. Data password Anda dienkripsi (Hashed) sehingga tidak ada pihak manapun yang bisa melihat password asli Anda." 
        />

        <Section 
          title="3. Data Medis & Resep" 
          content="Foto resep dokter yang Anda unggah hanya akan diakses oleh apoteker berlisensi kami untuk proses verifikasi. Kami tidak akan membagikan data medis Anda kepada pihak ketiga tanpa izin." 
        />

        <Section 
          title="4. Pembayaran" 
          content="Data metode pembayaran (nomor kartu/e-wallet) diproses melalui gerbang pembayaran resmi. Kami tidak menyimpan nomor kartu kredit penuh di server kami." 
        />

        <Section 
          title="5. Perubahan Kebijakan" 
          content="Kami berhak mengubah kebijakan privasi ini sewaktu-waktu. Perubahan akan diberitahukan melalui notifikasi di dalam aplikasi." 
        />

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { paddingTop: 60, padding: 20, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#EEE', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  lastUpdate: { color: '#999', fontSize: 12, marginBottom: 20 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#00A896', marginBottom: 10 },
  sectionContent: { fontSize: 14, color: '#444', lineHeight: 22, textAlign: 'justify' }
});