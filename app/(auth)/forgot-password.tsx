import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPassword() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.iconCircle}>
        <Ionicons name="lock-closed-outline" size={50} color="#00A896" />
      </View>

      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your Email or Phone number. You will receive a code to create a new password.</Text>

      <TextInput placeholder="Email or phone number" style={styles.input} />

      <TouchableOpacity style={styles.btn} onPress={() => router.push('/(auth)/otp')}>
        <Text style={styles.btnText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 30, alignItems: 'center', paddingTop: 80 },
  backBtn: { position: 'absolute', top: 50, left: 20 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F0F9F8', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  subtitle: { textAlign: 'center', color: '#666', lineHeight: 22, marginBottom: 30 },
  input: { width: '100%', borderBottomWidth: 1, borderBottomColor: '#EEE', paddingVertical: 12, fontSize: 16, marginBottom: 40 },
  btn: { backgroundColor: '#00A896', width: '100%', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});