import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

export default function BayarScreen() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const user = useAuthStore((state) => state.user);
  
  // State Pilihan User
  const [address, setAddress] = useState('Home Address');
  const [metode, setMetode] = useState('qris'); // Default ke QRIS
  const [loading, setLoading] = useState(false);

  // Perhitungan Harga (Pastikan Minimal 10.000 agar QRIS muncul)
  const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  const totalFix = subtotal < 10000 ? 10000 : subtotal; 

  const handlePayNow = async () => {
    if (!user || !user.name || !user.email) {
      Alert.alert("Error", "Sesi login habis. Silakan login ulang.");
      return;
    }

    setLoading(true);
    try {
      // Kirim data lengkap ke Laravel
      const response = await axios.post('http://172.29.134.139:8000/api/transaksi', {
        user_id: user.id,
        user_name: user.name,
        user_email: user.email,
        total_harga: totalFix,
        alamat_tujuan: address,
        items: items 
      });

      // Ambil Link Pembayaran dari Laravel
      const payUrl = response.data.payment_url;

      // PINDAH KE HALAMAN WEBVIEW (QRIS)
      router.push({ 
        pathname: '/transaksi/payment-page', 
        params: { url: payUrl } 
      } as any);

    } catch (error: any) {
      console.log("Error Detail:", error.response?.data);
      Alert.alert("Error", "Gagal memproses pembayaran. Cek koneksi internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Details</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        
        {/* RINGKASAN JUMLAH */}
        <View style={styles.topInfo}>
          <Text style={styles.itemCount}>{items.length} Items in your Cart</Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.totalLabel}>TOTAL TAGIHAN</Text>
            <Text style={styles.totalAmount}>Rp {totalFix.toLocaleString()}</Text>
          </View>
        </View>

        {/* ALAMAT */}
        <Text style={styles.sectionTitle}>DELIVERY ADDRESS</Text>
        
        <TouchableOpacity 
          style={[styles.addressCard, address === 'Home Address' && styles.cardActive]} 
          onPress={() => setAddress('Home Address')}
        >
          <Ionicons name="home-outline" size={24} color="#555" />
          <View style={styles.addressInfo}>
            <Text style={styles.addressName}>Home Address</Text>
            <Text style={styles.addressDetail}>Jl. Sudirman No. 12, Jakarta</Text>
          </View>
          <Ionicons 
            name={address === 'Home Address' ? "radio-button-on" : "radio-button-off"} 
            size={22} color="#00A896" 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.addressCard, address === 'Office Address' && styles.cardActive]} 
          onPress={() => setAddress('Office Address')}
        >
          <Ionicons name="business-outline" size={24} color="#555" />
          <View style={styles.addressInfo}>
            <Text style={styles.addressName}>Office Address</Text>
            <Text style={styles.addressDetail}>Gedung Century Lt. 5</Text>
          </View>
          <Ionicons 
            name={address === 'Office Address' ? "radio-button-on" : "radio-button-off"} 
            size={22} color="#00A896" 
          />
        </TouchableOpacity>

        {/* METODE BAYAR */}
        <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>

        <TouchableOpacity 
          style={[styles.addressCard, metode === 'qris' && styles.cardActive]} 
          onPress={() => setMetode('qris')}
        >
          <View style={[styles.payIconBox, {backgroundColor: '#00A896'}]}>
             <Ionicons name="qr-code" size={18} color="white" />
          </View>
          <View style={styles.addressInfo}>
            <Text style={styles.addressName}>QRIS / E-Wallet</Text>
            <Text style={styles.addressDetail}>OVO, DANA, GoPay, LinkAja</Text>
          </View>
          <Ionicons 
            name={metode === 'qris' ? "radio-button-on" : "radio-button-off"} 
            size={22} color="#00A896" 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.addressCard, metode === 'bank' && styles.cardActive]} 
          onPress={() => setMetode('bank')}
        >
          <View style={[styles.payIconBox, {backgroundColor: '#FF9800'}]}>
             <Ionicons name="business" size={18} color="white" />
          </View>
          <View style={styles.addressInfo}>
            <Text style={styles.addressName}>Bank Transfer</Text>
            <Text style={styles.addressDetail}>Virtual Account BCA, Mandiri, BNI</Text>
          </View>
          <Ionicons 
            name={metode === 'bank' ? "radio-button-on" : "radio-button-off"} 
            size={22} color="#00A896" 
          />
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* TOMBOL BAYAR FIX DI BAWAH */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.payBtn, loading && { backgroundColor: '#999' }]} 
          onPress={handlePayNow}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.payBtnText}>Pay now Rp {totalFix.toLocaleString()}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { backgroundColor: '#00A896', paddingTop: 60, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  topInfo: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#F5F5F5' },
  itemCount: { color: '#999', fontWeight: '500' },
  totalLabel: { fontSize: 10, color: '#999', fontWeight: 'bold' },
  totalAmount: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#333', marginLeft: 20, marginTop: 25, marginBottom: 15, letterSpacing: 1 },
  addressCard: { flexDirection: 'row', marginHorizontal: 20, padding: 18, borderWidth: 1, borderColor: '#EEE', borderRadius: 15, alignItems: 'center', marginBottom: 12 },
  cardActive: { borderColor: '#00A896', backgroundColor: '#F0FAF9' },
  addressInfo: { flex: 1, marginLeft: 15 },
  addressName: { fontWeight: 'bold', fontSize: 15, color: '#333' },
  addressDetail: { color: '#999', fontSize: 12, marginTop: 4 },
  payIconBox: { width: 38, height: 38, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'white', padding: 20, paddingBottom: 35, borderTopWidth: 1, borderColor: '#EEE' },
  payBtn: { backgroundColor: '#00A896', padding: 18, borderRadius: 15, alignItems: 'center' },
  payBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});