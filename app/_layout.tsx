import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Tetap panggil di luar untuk mencegah blink
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Sangat penting di SDK 56: Jangan render Navigator jika font belum load
  // agar internal hooks expo-router tidak "bingung" dengan state React 19
  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
       <Stack.Screen name="welcome" />
        <Stack.Screen name="(auth)/login" />
       
        <Stack.Screen name="obat/[id]" options={{ headerShown: true, title: 'Detail' }} />
        <Stack.Screen name="transaksi/keranjang" options={{ headerShown: true, title: 'Keranjang' }} />
        <Stack.Screen name="transaksi/bayar" options={{ headerShown: true, title: 'Checkout' }} />
        <Stack.Screen name="profile/edit" options={{ title: 'Edit Profile' }} />
        <Stack.Screen name="profile/address" options={{ title: 'Alamat Saya' }} />
        <Stack.Screen name="profile/payments" options={{ title: 'Metode Pembayaran' }} />
        <Stack.Screen name="profile/wishlist" options={{ title: 'Wishlist Saya' }} />
        <Stack.Screen name="profile/privacy" options={{ title: 'Kebijakan Privasi' }} />
        <Stack.Screen name="profile/help" options={{ title: 'Bantuan' }} />
        <Stack.Screen name="articles/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="transaksi/payment-page" options={{ title: 'Pembayaran', headerShown: true }} />
        <Stack.Screen name="admin/dashboard" />
        <Stack.Screen name="admin/add-obat" options={{ title: 'Tambah Obat' }} />
        <Stack.Screen name="ai/interaksi" options={{ title: 'AI Drug Checker', headerShown: true }} />
        <Stack.Screen name="admin/manage-stock" options={{ title: 'Kelola Stok' }} />
        <Stack.Screen name="admin/add-article" options={{ title: 'Tambah Artikel' }} />
        <Stack.Screen name="admin/manage-articles" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}