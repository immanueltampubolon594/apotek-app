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
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// 1. PASTIKAN ADA KATA 'export default'
export default function AIScreen() {
  const router = useRouter();
  const [obat1, setObat1] = useState('');
  const [obat2, setObat2] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState<any>(null);

  const handleCek = async () => {
    if (!obat1 || !obat2) return Alert.alert("Eror", "Masukkan nama 2 obat");
    
    setLoading(true);
    setHasil(null); // Reset hasil lama

    try {
      // 2. GANTI IP sesuai laptopmu
      const res = await axios.post('http://172.29.134.139:8000/api/ai/cek-keamanan', {
        obat1: obat1, 
        obat2: obat2
      });

      console.log("Respon AI:", res.data);
      setHasil(res.data);
    } catch (e: any) { 
      console.log("Error Detail:", e.response?.data || e.message);
      Alert.alert("Eror", "Gagal terhubung ke AI. Pastikan server Python & Laravel jalan."); 
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
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Medical Checker</Text>
        <View style={{width:24}} />
      </View>

      <ScrollView style={{padding: 20}} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#00A896" />
            <Text style={styles.infoText}>Gunakan fitur ini untuk mengecek efek samping jika dua obat diminum bersamaan.</Text>
        </View>

        <Text style={styles.label}>Nama Obat Pertama</Text>
        <TextInput 
          placeholder="Misal: Paracetamol" 
          style={styles.input} 
          value={obat1} 
          onChangeText={setObat1} 
        />

        <Text style={styles.label}>Nama Obat Kedua</Text>
        <TextInput 
          placeholder="Misal: Alcohol" 
          style={styles.input} 
          value={obat2} 
          onChangeText={setObat2} 
        />

        <TouchableOpacity 
          style={[styles.btn, loading && {backgroundColor: '#999'}]} 
          onPress={handleCek} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.btnText}>ANALISA KEAMANAN</Text>
          )}
        </TouchableOpacity>

        {/* AREA HASIL ANALISA */}
        {hasil && (
          <View style={[
            styles.resultBox, 
            { borderColor: hasil.status === 'Aman' ? '#4CAF50' : '#F44336' }
          ]}>
            <View style={styles.resultHeader}>
                <Ionicons 
                  name={hasil.status === 'Aman' ? "checkmark-circle" : "warning"} 
                  size={24} 
                  color={hasil.status === 'Aman' ? '#4CAF50' : '#F44336'} 
                />
                <Text style={[
                  styles.resultStatus, 
                  { color: hasil.status === 'Aman' ? '#4CAF50' : '#F44336' }
                ]}>
                  Analisa: {hasil.status}
                </Text>
            </View>
            <Text style={styles.resultPesan}>{hasil.pesan}</Text>
          </View>
        )}
        <View style={{height: 50}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { backgroundColor: '#00A896', paddingTop: 60, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  infoBox: { flexDirection: 'row', backgroundColor: '#E0F2F1', padding: 15, borderRadius: 12, marginBottom: 25, alignItems: 'center' },
  infoText: { flex: 1, marginLeft: 10, fontSize: 12, color: '#00796B', lineHeight: 18 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#555' },
input: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 12, marginBottom: 20, fontSize: 16 },
  btn: { backgroundColor: '#2E3E5C', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, elevation: 3 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  resultBox: { marginTop: 30, padding: 20, borderRadius: 15, borderWidth: 2, backgroundColor: '#FAFAFA' },
  resultHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  resultStatus: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  resultPesan: { fontSize: 15, lineHeight: 24, color: '#333', textAlign: 'justify' }
});