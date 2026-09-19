import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Sidebar from '../../components/drawer/Sidebar';
import { useAuthStore } from '../../store/authStore';

export default function MessagesScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // 1. Ambil daftar orang + Angka Notifikasi dari Laravel
  const fetchPartners = async () => {
    if (!user) return;
    try {
      // Kita panggil API yang baru kita buat (mengirimkan ID kita sendiri)
      const res = await axios.get(`http://172.29.134.139:8000/api/chat-partners/${user.id}`);
      setPartners(res.data);
    } catch (e) {
      console.log("Error fetch partners:", e);
    } finally {
      setLoading(false);
    }
  };

  // 2. Sistem Polling (Cek setiap 3 detik apakah ada chat baru)
  useEffect(() => {
    fetchPartners();
    const interval = setInterval(fetchPartners, 3000); 
    return () => clearInterval(interval);
  }, [user]);

  const goToChat = (item: any) => {
    router.push({ 
      pathname: '/messages/[id]', 
      params: { id: item.id, name: item.name } 
    } as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => setSidebarVisible(true)}>
            <Ionicons name="menu" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00A896" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={partners}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListHeaderComponent={
            partners.length > 0 ? (
              <View style={styles.onlineSection}>
                <Text style={styles.onlineLabel}>Online specialist</Text>
                <FlatList
                  horizontal
                  data={partners}
                  keyExtractor={(item) => 'online-' + item.id.toString()}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 15 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.onlineItem} onPress={() => goToChat(item)}>
                      <View style={styles.onlineAvatarWrapper}>
                        <Image 
                          source={{ uri: `https://i.pravatar.cc/150?u=${item.id}` }} 
                          style={styles.onlineAvatar} 
                        />
                        <View style={styles.onlineDotSmall} />
                      </View>
                      <Text style={styles.onlineName} numberOfLines={1}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.chatCard}
              onPress={() => goToChat(item)}
            >
              <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: `https://i.pravatar.cc/150?u=${item.id}` }} 
                  style={styles.avatar} 
                />
                {/* --- NOTIFIKASI ANGKA MERAH (di atas avatar, seperti referensi) --- */}
                {item.unread_count > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unread_count}</Text>
                  </View>
                )}
              </View>

              <View style={styles.chatInfo}>
                <Text style={styles.partnerName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.lastMsg} numberOfLines={1}>
                  {item.last_message || 'Klik untuk chat...'}
                </Text>
              </View>

              <Text style={styles.timeText}>{item.last_message_time || 'Now'}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{textAlign:'center', color:'#999', marginTop: 50}}>Belum ada percakapan.</Text>
          }
        />
      )}

      {/* FLOATING BUTTON CHAT BARU */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="chatbubble-ellipses" size={24} color="white" />
      </TouchableOpacity>

      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { backgroundColor: '#00A896', paddingTop: 60, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },

  // ONLINE SPECIALIST ROW
  onlineSection: { paddingTop: 18, paddingBottom: 10 },
  onlineLabel: { fontSize: 14, fontWeight: 'bold', color: '#333', marginLeft: 15, marginBottom: 12 },
  onlineItem: { alignItems: 'center', marginRight: 18, width: 60 },
  onlineAvatarWrapper: { position: 'relative' },
  onlineAvatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: '#00A896', backgroundColor: '#EEE' },
  onlineDotSmall: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: 'white' },
  onlineName: { fontSize: 11, color: '#555', marginTop: 6, textAlign: 'center' },

  // CHAT LIST
  chatCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  avatarContainer: { position: 'relative' },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#EEE' },
  chatInfo: { flex: 1, marginLeft: 14, marginRight: 8 },
  partnerName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  lastMsg: { fontSize: 13, color: '#888', marginTop: 3 },
  timeText: { fontSize: 11, color: '#AAA' },

  // BADGE MERAH DI POJOK AVATAR (seperti referensi)
  unreadBadge: {
    position: 'absolute',
    top: -4,
    left: -4,
    backgroundColor: '#FF5252',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 1.5,
    borderColor: 'white',
  },
  unreadText: { color: 'white', fontSize: 10, fontWeight: 'bold' },

  // FLOATING ACTION BUTTON
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#00A896',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});