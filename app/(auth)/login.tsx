import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 1. Validasi Input
    if (!email || !password) {
      Alert.alert("Error", "Harap isi email dan password!");
      return;
    }

    setLoading(true);
    try {
      // 2. Kirim data ke Backend (Gunakan IP Laptop kamu)
      const response = await axios.post('http://172.29.134.139:8000/api/login', {
        email: email,
        password: password
      });

      const userLogin = response.data.user;

      // 3. Simpan data user ke Zustand (Store)
      setUser(userLogin);
      
      Alert.alert("Sukses", `Selamat datang kembali, ${userLogin.name}`);

      // 4. LOGIKA PEMISAH ROLE
      if (userLogin.role === 'admin') {
        // Jika akun adalah Admin, pergi ke Dashboard khusus Admin
        router.replace('/admin/dashboard' as any);
      } else {
        // Jika akun adalah User Biasa, pergi ke Dashboard Pembeli
        router.replace('/(tabs)'); 
      }

    } catch (error: any) {
      console.log(error);
      const msg = error.response?.data?.message || "Email atau password salah. Cek koneksi server.";
      Alert.alert("Login Gagal", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER LOGO */}
      <View style={styles.greenHeader}>
         <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png' }} 
          style={styles.logo} 
        />
        <Text style={styles.headerTitle}>BEST ONLINE MEDICINE DELIVERY APP</Text>
      </View>

      {/* FORM LOGIN */}
      <View style={styles.formCard}>
        <Text style={styles.loginTitle}>Sign In</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput 
            placeholder="Enter your email" 
            style={styles.input} 
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput 
            placeholder="Enter your password" 
            style={styles.input} 
            secureTextEntry 
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password' as any)}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* TOMBOL SIGN IN */}
        <TouchableOpacity 
          style={[styles.signInButton, loading && { backgroundColor: '#999' }]} 
          onPress={handleLogin} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.signInText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* LINK KE REGISTER */}
        <TouchableOpacity onPress={() => router.push('/(auth)/register' as any)}>
          <Text style={styles.footerText}>
            Don't have an account? <Text style={{color: '#FF7043', fontWeight: 'bold'}}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#00A896' },
  greenHeader: { height: '35%', justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { width: 80, height: 80, marginBottom: 20 },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', textAlign: 'center', paddingHorizontal: 20 },
  formCard: { 
    flex: 1, 
    backgroundColor: 'white', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 30 
  },
  loginTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 25, color: '#333' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#666', marginBottom: 5, fontWeight: '600' },
  input: { borderBottomWidth: 1, borderBottomColor: '#EEE', paddingVertical: 10, fontSize: 16, color: '#333' },
  forgotText: { color: '#00A896', alignSelf: 'flex-end', marginBottom: 30, fontWeight: '600' },
  signInButton: { 
    backgroundColor: '#00A896', 
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center',
    elevation: 3,
  },
  signInText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  footerText: { textAlign: 'center', marginTop: 25, color: '#666', fontSize: 15 }
});