import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CustomDrawer() {
  const router = useRouter();

  const MenuItem = ({ icon, title, path }: any) => (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={() => path && router.push(path)}
    >
      <Ionicons name={icon} size={22} color="#555" />
      <Text style={styles.menuText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Profil di atas Sidebar */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: 'https://i.pravatar.cc/150?u=annie' }} style={styles.avatar} />
        <View style={{marginLeft: 15}}>
          <Text style={styles.name}>Annie Duffy</Text>
          <Text style={styles.location}>San Francisco, CA</Text>
        </View>
      </View>

      <View style={styles.menuList}>
        <MenuItem icon="medical-outline" title="Shop By Medicine" path="/obat" />
        <MenuItem icon="cloud-upload-outline" title="Upload Prescription" />
        <MenuItem icon="fitness-outline" title="OTC & Wellness" />
        <MenuItem icon="receipt-outline" title="My Order" path="/orders" />
        <MenuItem icon="person-outline" title="My Profile" path="/profile" />
        <MenuItem icon="pricetag-outline" title="Offers & Discounts" />
        <MenuItem icon="help-circle-outline" title="FAQs & Help" />
        
        <View style={styles.divider} />
        
        <MenuItem icon="log-out-outline" title="Log out" path="/(auth)/login" />
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>Pharmacy App v2.0.5</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  profileHeader: { padding: 25, paddingTop: 60, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA' },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  name: { fontSize: 18, fontWeight: 'bold' },
  location: { fontSize: 12, color: '#999' },
  menuList: { padding: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  menuText: { marginLeft: 20, fontSize: 16, color: '#444' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 10 },
  footer: { position: 'absolute', bottom: 30, left: 20 },
  version: { fontSize: 12, color: '#CCC' }
});