import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Sidebar from '../../components/drawer/Sidebar';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

// === PELACAK SEMENTARA UNTUK CARI SUMBER ERROR 401 ===
// Hapus blok ini lagi setelah sumbernya ketemu dan diperbaiki.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('🔴 AXIOS ERROR URL:', error.config?.method?.toUpperCase(), error.config?.url);
    console.log('🔴 AXIOS ERROR STATUS:', error.response?.status);
    console.log('🔴 AXIOS ERROR DATA:', JSON.stringify(error.response?.data));
    return Promise.reject(error);
  }
);
// === AKHIR PELACAK SEMENTARA ===

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 20;

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const cartItems = useCartStore((state) => state.items);
  
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchHome, setSearchHome] = useState('');
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loadingProduk, setLoadingProduk] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All Categories');

  const isAdmin = user?.name?.toLowerCase().includes('admin');

  const getObat = async (category: string) => {
    try {
      setLoadingProduk(true);
      const url = category === 'All Categories'
        ? 'http://172.29.134.139:8000/api/obat'
        : `http://172.29.134.139:8000/api/obat?category=${encodeURIComponent(category)}`;
      const response = await axios.get(url);
      setMedicines(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProduk(false);
    }
  };

  useEffect(() => {
    getObat(activeCategory);
  }, [activeCategory]);

  const pickImage = async () => {
    if (!user) {
      Alert.alert("Login Dulu", "Silakan login untuk upload resep.");
      router.push('/(auth)/login' as any);
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setLoading(true);
      const formData = new FormData();
      // @ts-ignore
      formData.append('image', {
        uri: result.assets[0].uri,
        name: 'resep.jpg',
        type: 'image/jpeg',
      });
      formData.append('user_id', user.id);

      try {
        await axios.post('http://172.29.134.139:8000/api/upload-resep', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        Alert.alert("Berhasil", "Resep kamu sudah terkirim ke Apoteker!");
      } catch (error) {
        Alert.alert("Gagal", "Gagal mengirim ke server.");
      } finally {
        setLoading(false);
      }
    }
  };

  const categories = [
  { name: 'All Categories', label: 'All', icon: 'grid', color: '#5C6BC0', image: null },
  { name: "Women's Health", label: "Women's", icon: null, color: '#FF5252', image: require('../../assets/images/Wellness.png') },
  { name: 'Skin & Hair', label: 'Skin & Hair', icon: null, color: '#4CAF50', image: require('../../assets/images/Ayurveda.png') },
  { name: 'Diabetes Management', label: 'Diabetes', icon: null, color: '#2196F3', image: require('../../assets/images/Diabetes.png') },
  { name: 'Vitamins', label: 'Vitamins', icon: null, color: '#FF9800', image: require('../../assets/images/Vitamins.png') },
];

  const ListHeader = () => (
    <View>
      {/* HEADER HIJAU */}
      <View style={styles.header}>
        <View style={styles.topIconsRow}>
          <TouchableOpacity onPress={() => setSidebarVisible(true)}>
            <Ionicons name="menu" size={32} color="white" />
          </TouchableOpacity>
          <View style={styles.rightIcons}>
            <TouchableOpacity style={{ marginRight: 15 }}>
              <Ionicons name="search" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/transaksi/keranjang' as any)}>
              <Ionicons name="cart-outline" size={26} color="white" />
              {cartItems.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartItems.length}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 15 }}>
              <Ionicons name="notifications-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.greetingBox}>
          <Text style={styles.welcomeText} numberOfLines={1}>
            Hi, {user?.name || 'User'} 👋
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={13} color="rgba(255,255,255,0.85)" />
            <Text style={styles.locationText}>Jakarta, Indonesia</Text>
          </View>
        </View>

        <View style={styles.heroTextContainer}>
          <Text style={styles.heroSmallText}>BEST ONLINE</Text>
          <Text style={styles.heroLargeText}>MEDICINE</Text>
          <Text style={styles.heroSmallText}>DELIVERY SERVICE</Text>
        </View>

        <View style={styles.featureRow}>
          <View style={styles.featureItem}>
            <Ionicons name="flash" size={14} color="#FFEB3B" />
            <Text style={styles.featureText}>Fast Delivery</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="shield-checkmark" size={14} color="#FFEB3B" />
            <Text style={styles.featureText}>100% Genuine</Text>
          </View>
        </View>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchFloating}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search Products..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchHome}
          onChangeText={setSearchHome}
          onSubmitEditing={() => router.push({ pathname: '/(tabs)/two', params: { search: searchHome } } as any)}
        />
      </View>

      {/* ADMIN MENU */}
      {isAdmin && (
        <TouchableOpacity 
          style={styles.adminEntryCard} 
          onPress={() => router.push('/admin/dashboard' as any)}
        >
          <View style={styles.adminIconBox}>
            <Ionicons name="settings" size={22} color="white" />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.adminEntryTitle}>Kelola Toko (Admin)</Text>
            <Text style={styles.adminEntrySub}>Lihat Pendapatan, Stok & Pesanan</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#00A896" />
        </TouchableOpacity>
      )}

      {/* UPLOAD RESEP */}
      <TouchableOpacity style={styles.orangeBtn} onPress={pickImage}>
        {loading ? <ActivityIndicator color="white" /> : (
          <>
            <Ionicons name="camera" size={24} color="white" />
            <Text style={styles.orangeBtnText}>Upload your Prescription</Text>
          </>
        )}
      </TouchableOpacity>

      {/* TOP CATEGORIES */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Categories</Text>
        <TouchableOpacity onPress={() => router.push('/obat/categories' as any)}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.catRow}>
  {categories.map((item) => (
    <TouchableOpacity 
      key={item.name}
      style={styles.catItem}
      onPress={() => {
        setActiveCategory(item.name);
        router.push({ 
          pathname: '/(tabs)/two', 
          params: { category: encodeURIComponent(item.name) } 
        } as any);
      }}
    >
      <View style={[
        styles.catIconCircle, 
        { backgroundColor: item.color },
        activeCategory === item.name && styles.catIconCircleActive
      ]}>
        {item.image 
          ? <Image source={item.image} style={{ width: 36, height: 36, tintColor: 'white' }} resizeMode="contain" />
          : <Ionicons name={item.icon as any} size={24} color="white" />
        }
      </View>
      <Text 
  style={[styles.catLabel, activeCategory === item.name && styles.catLabelActive]}
  numberOfLines={1}
>
  {item.label}
</Text>
    </TouchableOpacity>
  ))}
</View>

      {/* DEALS & OFFERS */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Deals & Offers</Text>
      </View>
      <Text style={styles.dealsSubtitle}>Get special discounts and offers on Medicine</Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dealsScroll}
        data={[
          { id: '1', percent: '20% OFF', label: 'On Prescription Drugs', color: '#2979FF' },
          { id: '2', percent: '15% OFF', label: 'Vitamins & Supplements', color: '#7C4DFF' },
          { id: '3', percent: '10% OFF', label: 'Mother & Baby Care', color: '#FF7043' },
        ]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.dealCard, { backgroundColor: item.color }]}
            onPress={() => setActiveCategory('All Categories')}
          >
            <View style={styles.dealTextWrap}>
              <Text style={styles.dealPercent}>{item.percent}</Text>
              <Text style={styles.dealLabel}>{item.label}</Text>
            </View>
            <Image
              source={require('../../assets/images/dokter.png')}
              style={styles.dealImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {activeCategory === 'All Categories' ? 'Semua Produk' : activeCategory}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <StatusBar barStyle="light-content" />

      <FlatList
        data={medicines}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={{ paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          loadingProduk ? (
            <View style={{ paddingVertical: 40 }}>
              <ActivityIndicator size="large" color="#00A896" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loadingProduk ? (
            <Text style={styles.emptyText}>Belum ada obat di kategori ini.</Text>
          ) : null
        }
        renderItem={({ item }) => {
          const isDiscount = item.harga_asli && parseFloat(item.harga_asli) > parseFloat(item.harga);
          return (
            <TouchableOpacity 
              style={[styles.card, isDiscount && styles.cardDiscount]}
              onPress={() => router.push({ pathname: '/obat/[id]', params: { id: item.id } } as any)}
            >
              <TouchableOpacity style={styles.heartIcon}>
                <Ionicons name="heart-outline" size={18} color="#CCC" />
              </TouchableOpacity>

              {isDiscount && (
                <View style={styles.saleBadge}>
                  <Text style={styles.saleText}>Sale</Text>
                </View>
              )}

              <View style={styles.imageWrapper}>
                <Image source={{ uri: item.foto }} style={styles.productImage} />
              </View>

              <View style={styles.productDetails}>
                <Text style={styles.productName} numberOfLines={1}>{item.nama}</Text>
                <Text style={styles.productSub} numberOfLines={1}>{item.deskripsi || 'Sediaan Obat'}</Text>

                <View style={styles.priceContainer}>
                  <Text style={styles.currentPrice}>
                    Rp {parseFloat(item.harga).toLocaleString('id-ID')}
                  </Text>
                  {isDiscount && (
                    <View style={styles.discountRow}>
                      <Text style={styles.strikePrice}>
                        Rp {parseFloat(item.harga_asli).toLocaleString('id-ID')}
                      </Text>
                      <Text style={styles.percentText}>
                        {Math.round(((item.harga_asli - item.harga) / item.harga_asli) * 100)}% OFF
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#00A896',
    paddingTop: 50,
    paddingBottom: 45,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  topIconsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  rightIcons: { flexDirection: 'row', alignItems: 'center' },
  badge: { 
    position: 'absolute', right: -6, top: -4, 
    backgroundColor: '#FF7043', borderRadius: 8, 
    minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: 'white'
  },
  badgeText: { color: 'white', fontSize: 9, fontWeight: 'bold' },
  greetingBox: { marginBottom: 15 },
  welcomeText: { color: 'white', fontSize: 22, fontWeight: '700' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { color: 'white', fontSize: 12, marginLeft: 4, opacity: 0.8 },
  heroTextContainer: { alignItems: 'center', marginTop: 10 },
  heroSmallText: { color: 'white', fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  heroLargeText: { color: '#FFEB3B', fontSize: 42, fontWeight: '900', marginVertical: -5 },
  featureRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 15 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
  featureText: { color: 'white', fontSize: 11, marginLeft: 5, fontWeight: '600' },
  searchFloating: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
    marginHorizontal: 20, marginTop: -25, paddingHorizontal: 16,
    height: 56, borderRadius: 15, elevation: 8,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#333' },
  adminEntryCard: {
    margin: 20, marginTop: 25, padding: 18, backgroundColor: '#E0F2F1',
    borderRadius: 20, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#00A896', elevation: 3
  },
  adminIconBox: { width: 45, height: 45, backgroundColor: '#00A896', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  adminEntryTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  adminEntrySub: { fontSize: 12, color: '#666', marginTop: 2 },
  orangeBtn: { backgroundColor: '#FF7043', marginHorizontal: 20, marginTop: 10, padding: 18, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  orangeBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  viewAll: { color: '#00A896', fontWeight: 'bold' },
  catRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, marginTop: 15 },
catItem: { alignItems: 'center', flex: 1 },
  catIconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 3, overflow: 'hidden' },
  catIconCircleActive: { borderWidth: 3, borderColor: '#00A896' },
 catLabel: { marginTop: 8, fontSize: 12, color: '#444', fontWeight: '500', textAlign: 'center' },
  catLabelActive: { color: '#00A896', fontWeight: 'bold' },
  dealsSubtitle: { fontSize: 12, color: '#999', paddingHorizontal: 20, marginTop: 2 },
  dealsScroll: { paddingLeft: 20, marginTop: 5 },
  dealCard: {
    width: width - 90, height: 110, borderRadius: 18, marginRight: 14,
    paddingLeft: 20, paddingVertical: 16, flexDirection: 'row',
    alignItems: 'center', overflow: 'hidden', elevation: 3,
  },
  dealTextWrap: { flex: 1 },
  dealPercent: { color: 'white', fontSize: 34, fontWeight: '900' },
  dealLabel: { color: 'white', fontSize: 13, fontWeight: '600', marginTop: 6 },
  dealImage: { width: 100, height: 110, marginRight: -2 },
  listContainer: { paddingTop: 5, paddingBottom: 100 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40, width: '100%' },
  card: {
    backgroundColor: 'white', width: cardWidth, margin: 6, borderRadius: 15,
    padding: 10, elevation: 3, borderWidth: 1, borderColor: 'transparent', minHeight: 230,
  },
  cardDiscount: { borderColor: '#00A896' },
  heartIcon: { position: 'absolute', top: 10, right: 10, zIndex: 10 },
  saleBadge: {
    position: 'absolute', top: 0, left: 0, backgroundColor: '#FF8A65',
    paddingHorizontal: 10, paddingVertical: 4,
    borderTopLeftRadius: 15, borderBottomRightRadius: 10, zIndex: 10,
  },
  saleText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  imageWrapper: { width: '100%', height: 120, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  productImage: { width: '90%', height: '100%', resizeMode: 'contain' },
  productDetails: { marginTop: 8 },
  productName: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  productSub: { fontSize: 11, color: '#999', marginBottom: 8 },
  priceContainer: { marginTop: 'auto', paddingTop: 5, borderTopWidth: 0.5, borderTopColor: '#F0F0F0' },
  currentPrice: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  discountRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  strikePrice: { fontSize: 10, color: '#BBB', textDecorationLine: 'line-through' },
  percentText: { fontSize: 10, color: '#4CAF50', fontWeight: 'bold', marginLeft: 6 },
});