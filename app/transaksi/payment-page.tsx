import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function PaymentPage() {
  const { url } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <WebView 
        source={{ uri: url as string }} 
        style={{ flex: 1 }}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loader}><ActivityIndicator size="large" color="#00A896" /></View>
        )}
        onNavigationStateChange={(navState) => {
          // JIKA TERDETEKSI REDIRECT KE EXAMPLE ATAU FINISH
          // Ini tandanya pembayaran sudah sukses dilakukan di simulator
         if (
  navState.url.includes('example.com') || 
  navState.url.includes('/finish') || 
  navState.url.includes('transaction_status=settlement') ||
  navState.url.includes('transaction_status=capture')
)
          {
            // Tunggu 1 detik lalu balik ke menu My Orders
            setTimeout(() => {
                router.replace('/(tabs)/orders');
            }, 1000);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { position: 'absolute', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }
});