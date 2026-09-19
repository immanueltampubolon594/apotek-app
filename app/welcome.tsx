import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Background peta dunia (opsional, bisa pakai gambar) */}
      <View style={styles.topSection}>
        {/* Logo obat / kapsul */}
        <Image
        source={require('../assets/images/Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Apotek Century</Text>
        <Text style={styles.slogan}>YOUR TRUSTED PHARMACY</Text>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.title}>Obat Mudah,{'\n'}Kesehatan Terjaga</Text>
        <Text style={styles.subtitle}>
          Temukan obat-obatan berkualitas dan konsultasikan kesehatanmu kapan saja.
        </Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.replace('/(auth)/login' as any)}
        >
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },

  topSection: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: 40,
},
  logo: {
  width: 3000,
  height: 250,
  marginBottom: -20,
},
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00A896',
    marginTop: 0,
  },
  slogan: {
    fontSize: 12,
    color: '#999',
    letterSpacing: 2,
    marginTop: 4,
  },

  bottomSection: {
    paddingHorizontal: 30,
    paddingBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#222',
    lineHeight: 38,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    lineHeight: 22,
    marginBottom: 36,
  },
  btn: {
    backgroundColor: '#00A896',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#00A896',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  btnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});