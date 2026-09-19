import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  ActivityIndicator, 
  StatusBar 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

export default function PaymentsScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Input
  const [provider, setProvider] = useState('');
  const [number, setNumber] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // 1. Ambil Data dari Laravel
  const fetchPayments = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`http://10.156.234.139:8000/api/payments/${user.id}`);
      setPayments(res.data);
    } catch (e) {
      console.log("Error fetch payments:", e);
    } finally {
      setLoading(false);
    }
  };

  // 2. Tambah Metode Baru
  const handleAdd = async () => {
    if (!provider || !number) {
      return Alert.alert("Peringatan", "Harap isi nama provider dan nomor akun.");
    }
    
    setIsAdding(true);
    try {
      await axios.post('http://10.156.234.139:8000/api/payments', {
        user_id: user.id,
        provider: provider.toUpperCase(),
        account_number: number,
        type: provider.toLowerCase().includes('visa') || provider.toLowerCase().includes('master') ? 'card' : 'wallet'
      });
      
      setProvider('');
      setNumber('');
      fetchPayments();
      Alert.alert("Sukses", "Metode pembayaran berhasil ditambahkan!");
    } catch (e) {
      Alert.alert("Gagal", "Tidak dapat menyimpan data ke server.");
    } finally {
      setIsAdding(false);
    }
  };

  // 3. Hapus Metode
  const handleDelete = (id: number) => {
    Alert.alert("Hapus", "Hapus metode pembayaran ini?", [
      { text: "Batal", style: "cancel" },
      { text: "Ya, Hapus", style: 'destructive', onPress: async () => {
          try {
            await axios.delete(`http://10.156.234.139:8000/api/payments/${id}`);
            fetchPayments();
          } catch (e) { console.log(e); }
      }}
    ]);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {/* FORM TAMBAH */}
        <View style={styles.addSection}>
          <Text style={styles.sectionTitle}>Add New Method</Text>
          <View style={styles.inputCard}>
            <TextInput 
              placeholder="Provider (DANA, OVO, VISA, etc)" 
              style={styles.input} 
              value={provider} 
              onChangeText={setProvider} 
              placeholderTextColor="#AAA"
            />
            <TextInput 
              placeholder="Account or Card Number" 
              style={styles.input} 
              keyboardType="numeric" 
              value={number} 
              onChangeText={setNumber} 
              placeholderTextColor="#AAA"
            />
            <TouchableOpacity 
              style={[styles.addBtn, isAdding && { backgroundColor: '#999' }]} 
              onPress={handleAdd}
              disabled={isAdding}
            >
              {isAdding ? <ActivityIndicator color="white" /> : <Text style={styles.addBtnText}>Link Account</Text>}
            </TouchableOpacity>
          </View>
        </View>

        {/* LIST METODE PEMBAYARAN */}
        <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
          <Text style={styles.sectionTitle}>Your Linked Accounts</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#00A896" style={{ marginTop: 20 }} />
          ) : (
            payments.map((item) => (
              <View key={item.id} style={styles.paymentCard}>
                <View style={[styles.iconBox, { backgroundColor: item.type === 'card' ? '#E3F2FD' : '#F3E5F5' }]}>
                  <Ionicons 
                    name={item.type === 'card' ? "card" : "wallet"} 
                    size={24} 
                    color={item.type === 'card' ? "#2196F3" : "#9C27B0"} 
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 15 }}>
                  <Text style={styles.providerName}>{item.provider}</Text>
                  <Text style={styles.accountNumber}>{item.account_number}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash-outline" size={22} color="#FF5252" />
                </TouchableOpacity>
              </View>
            ))
          )}
          
          {!loading && payments.length === 0 && (
            <Text style={styles.emptyText}>No payment methods linked yet.</Text>
          )}
        </View>
        
        <View style={{height: 50}} />
      </ScrollView>
    </View>
  );
}

// Komponen ScrollView perlu di-import
import { ScrollView } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    paddingTop: 60, 
    paddingBottom: 20, 
    paddingHorizontal: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    backgroundColor: 'white', 
    borderBottomWidth: 1, 
    borderColor: '#EEE',
    alignItems: 'center'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  
  addSection: { padding: 20 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#666', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  inputCard: { backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  input: { borderBottomWidth: 1, borderColor: '#F0F0F0', paddingVertical: 12, marginBottom: 15, fontSize: 15, color: '#333' },
  
  addBtn: { backgroundColor: '#9C27B0', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 5 },
  addBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  
  paymentCard: { 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    marginBottom: 12, 
    padding: 18, 
    borderRadius: 16, 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    alignItems: 'center' 
  },
  iconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  providerName: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  accountNumber: { color: '#888', fontSize: 13, marginTop: 2 },
  emptyText: { textAlign: 'center', marginTop: 30, color: '#AAA', fontSize: 14 }
});