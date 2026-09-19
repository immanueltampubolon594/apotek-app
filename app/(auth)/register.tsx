import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  
  // 1. State Input (Hanya Nama, Email, Password)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Fungsi Register
  const handleSignUp = async () => {
    // Validasi Sederhana
    if (!name || !email || !password) {
      Alert.alert("Error", "Semua kolom wajib diisi!");
      return;
    }

    setLoading(true);
    try {
      // GANTI IP di bawah ini dengan IP Laptop kamu yang muncul di terminal npx expo start
      const response = await axios.post('http://172.29.134.139:8000/api/register', {
        name: name,
        email: email,
        password: password,
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert("Berhasil", "Akun berhasil dibuat! Silakan login.");
        router.replace('/(auth)/login' as any);
      }
    } catch (error: any) {
      console.log("Error Detail:", error.response?.data);

      if (error.response?.status === 422) {
        // MENANGKAP ERROR VALIDASI (Misal: email sudah terdaftar)
        const errors = error.response.data.errors;
        let errorMessage = "";
        
        Object.keys(errors).forEach((key) => {
          errorMessage += `${errors[key][0]}\n`;
        });

        Alert.alert("Registrasi Gagal", errorMessage.trim());
      } else {
        Alert.alert("Error", "Gagal terhubung ke server. Pastikan IP benar & Laravel sedang jalan.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Tombol Back */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to browse Online Medicine near by location</Text>

        {/* Input Nama */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full name</Text>
          <TextInput 
            placeholder="Enter your name" 
            style={styles.input} 
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Input Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email address</Text>
          <TextInput 
            placeholder="Enter your email" 
            style={styles.input} 
            keyboardType="email-address" 
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Input Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput 
            placeholder="Min. 6 characters" 
            style={styles.input} 
            secureTextEntry 
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Tombol Sign Up */}
        <TouchableOpacity 
          style={[styles.signUpButton, loading && { backgroundColor: '#999' }]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.signUpText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Link kembali ke Login */}
        <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={{color: '#00A896', fontWeight: 'bold'}}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  backButton: { marginTop: 60, marginLeft: 20 },
  content: { paddingHorizontal: 30, paddingTop: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  subtitle: { color: '#888', marginBottom: 30, lineHeight: 22, fontSize: 15 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 8 },
  input: { 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEE', 
    paddingVertical: 10, 
    fontSize: 16,
    color: '#333'
  },
  signUpButton: { 
    backgroundColor: '#00A896', 
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center',
    marginTop: 30,
    elevation: 3,
  },
  signUpText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  footerText: { textAlign: 'center', marginTop: 30, color: '#666', fontSize: 15 }
});