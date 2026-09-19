import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function OTPScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phone Verification</Text>
      <Text style={styles.subtitle}>Enter the 5-digit code you received in SMS on +01 (760) 653-5300 <Text style={{color: '#00A896'}}>Edit</Text></Text>

      <View style={styles.otpContainer}>
        {[1, 2, 3, 4, 5].map((_, i) => (
          <TextInput key={i} style={styles.otpBox} keyboardType="number-pad" maxLength={1} />
        ))}
      </View>

      <Text style={styles.resend}>Didn't receive a code? <Text style={{color: '#FF7043'}}>Resend</Text></Text>

      <TouchableOpacity style={styles.btn} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.btnText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 30, alignItems: 'center', paddingTop: 100 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  subtitle: { textAlign: 'center', color: '#666', lineHeight: 22, marginBottom: 40 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 30 },
  otpBox: { width: 55, height: 55, borderBottomWidth: 2, borderBottomColor: '#EEE', textAlign: 'center', fontSize: 24, fontWeight: 'bold' },
  resend: { color: '#666', marginBottom: 40 },
  btn: { backgroundColor: '#00A896', width: '100%', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});