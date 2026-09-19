import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator, Alert, Dimensions,
    Image,
    LayoutAnimation, Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View
} from 'react-native';
import { useCartStore } from '../../store/cartStore';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

// --- KONTEN ACCORDION ---
// Karena database baru punya field "deskripsi" umum, bagian lain pakai placeholder
// standar dulu. Nanti kalau mau, tinggal tambah kolom baru di tabel obat per section.
const ACCORDION_SECTIONS = (obat: any) => [
  {
    title: 'Products Overview',
    content: obat.deskripsi || 'Belum ada deskripsi untuk produk ini.',
  },
  {
    title: 'Usage, Direction and Dosage',
    content: 'Gunakan sesuai anjuran dokter atau apoteker. Baca petunjuk pada kemasan sebelum menggunakan produk ini.',
  },
  {
    title: 'Interactions',
    content: 'Konsultasikan dengan apoteker atau dokter sebelum mengombinasikan produk ini dengan obat lain.',
  },
  {
    title: 'Side Effects',
    content: 'Efek samping yang mungkin terjadi bervariasi tiap individu. Hentikan penggunaan dan konsultasikan ke dokter jika muncul reaksi yang tidak diinginkan.',
  },
  {
    title: 'Expert advice and Concern',
    content: 'Disarankan berkonsultasi dengan apoteker kami melalui fitur "Ask a Question" untuk saran penggunaan yang sesuai kondisi Anda.',
  },
  {
    title: 'When not to use?',
    content: 'Jangan digunakan jika Anda memiliki riwayat alergi terhadap salah satu kandungan produk ini, atau sedang dalam kondisi medis tertentu tanpa anjuran dokter.',
  },
  {
    title: 'General Instructions & Warnings',
    content: 'Simpan di tempat sejuk dan kering, jauhkan dari sinar matahari langsung dan dari jangkauan anak-anak.',
  },
  {
    title: 'Other Details',
    content: 'Hubungi apoteker kami jika ada pertanyaan lebih lanjut mengenai produk ini.',
  },
];

export default function DetailObat() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  
  const [obat, setObat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const getDetailObat = async () => {
    try {
      const response = await axios.get(`http://172.29.134.139:8000/api/obat/${id}`);
      setObat(response.data);
    } catch (error) {
      console.error("Gagal ambil detail:", error);
      Alert.alert("Error", "Gagal mengambil data dari server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetailObat();
  }, [id]);

  const toggleSection = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection(expandedSection === index ? null : index);
  };

  const changeQty = (delta: number) => {
    setQty((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (obat?.stok && next > obat.stok) return obat.stok;
      return next;
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingFull}>
        <ActivityIndicator size="large" color="#00A896" />
      </View>
    );
  }

  if (!obat) {
    return (
      <View style={styles.loadingFull}>
        <Text>Obat tidak ditemukan</Text>
      </View>
    );
  }

  const isDiscount = obat.harga_asli && parseFloat(obat.harga_asli) > parseFloat(obat.harga);
  const discountPercent = isDiscount
    ? Math.round(((obat.harga_asli - obat.harga) / obat.harga_asli) * 100)
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00A896" />
      
      {/* HEADER */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>Product Details</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={{ marginRight: 16 }}>
            <Ionicons name="share-social-outline" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/transaksi/keranjang' as any)}>
            <Ionicons name="cart-outline" size={22} color="white" />
            <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>3</Text></View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO GAMBAR */}
        <View style={styles.heroSection}>
          <View style={styles.rxBadge}>
            <Text style={styles.rxBadgeText}>Rx</Text>
          </View>

          <Image source={{ uri: obat.foto }} style={styles.mainImage} resizeMode="contain" />

          <TouchableOpacity style={styles.wishlistBtn}>
            <Ionicons name="heart-outline" size={22} color="#FF7043" />
          </TouchableOpacity>
        </View>

        {/* CONTENT */}
        <View style={styles.contentCard}>
          {/* NAMA + RATING + STOK */}
          <Text style={styles.productTitle}>{obat.nama}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaSub}>
              {obat.deskripsi ? obat.deskripsi.slice(0, 30) : 'Sediaan Obat'}
            </Text>
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={13} color="#FFC107" />
              <Text style={styles.ratingText}>4.0</Text>
            </View>
          </View>
          <Text style={styles.stockText}>Available in stock {obat.stok}</Text>

          {/* HARGA */}
          <View style={styles.priceRow}>
            <Text style={styles.currentPriceText}>
              Rp {parseFloat(obat.harga).toLocaleString('id-ID')}
            </Text>
            {isDiscount && (
              <>
                <Text style={styles.oldPriceText}>
                  MRP Rp {parseFloat(obat.harga_asli).toLocaleString('id-ID')}
                </Text>
                <Text style={styles.discountText}>{discountPercent}% OFF</Text>
              </>
            )}
          </View>
          {obat.kategori?.nama && (
            <Text style={styles.mfrText}>Kategori: {obat.kategori.nama}</Text>
          )}

          <View style={styles.divider} />

          {/* QUANTITY SELECTOR */}
          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>Select Quantity</Text>
            <View style={styles.qtyControl}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(-1)}>
                <Ionicons name="remove" size={18} color="#00A896" />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{qty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(1)}>
                <Ionicons name="add" size={18} color="#00A896" />
              </TouchableOpacity>
            </View>
          </View>

          {/* CHECK DELIVERY */}
          <View style={styles.deliveryRow}>
            <Text style={styles.qtyLabel}>Check Delivery</Text>
            <TouchableOpacity style={styles.checkBtn}>
              <Text style={styles.checkBtnText}>Check</Text>
            </TouchableOpacity>
          </View>

          {/* TOMBOL AKSI */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.askBtn}
              onPress={() => router.push('/messages' as any)}
            >
              <Text style={styles.askBtnText}>Ask A Question</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cartBtn}
              onPress={() => {
                addItem({
                  id: id as string,
                  name: obat.nama,
                  price: parseFloat(obat.harga),
                  quantity: qty,
                  image: obat.foto
                });
                Alert.alert("Berhasil", `${qty}x ${obat.nama} ditambah ke keranjang`);
              }}
            >
              <Text style={styles.cartBtnText}>Add To Cart</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* ACCORDION SECTIONS */}
          {ACCORDION_SECTIONS(obat).map((section, index) => {
            const isOpen = expandedSection === index;
            return (
              <View key={index} style={styles.accordionItem}>
                <TouchableOpacity 
                  style={styles.accordionHeader} 
                  onPress={() => toggleSection(index)}
                >
                  <Text style={styles.accordionTitle}>{section.title}</Text>
                  <Ionicons 
                    name={isOpen ? 'chevron-up' : 'chevron-down'} 
                    size={18} 
                    color="#999" 
                  />
                </TouchableOpacity>
                {isOpen && (
                  <Text style={styles.accordionContent}>{section.content}</Text>
                )}
              </View>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  loadingFull: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  topNav: {
    backgroundColor: '#00A896',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
  },
  topNavTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cartBadge: { position: 'absolute', right: -6, top: -4, backgroundColor: '#FF8A65', borderRadius: 8, width: 14, height: 14, justifyContent: 'center', alignItems: 'center' },
  cartBadgeText: { color: 'white', fontSize: 8, fontWeight: 'bold' },

  heroSection: {
    width: width,
    height: 220,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  rxBadge: {
    position: 'absolute', left: 16, top: 16,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center', alignItems: 'center',
  },
  rxBadgeText: { color: '#00A896', fontWeight: 'bold', fontSize: 12 },
  mainImage: { width: '60%', height: '80%' },
  wishlistBtn: {
    position: 'absolute', right: 16, top: 16,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center', alignItems: 'center',
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4,
  },

  contentCard: { paddingHorizontal: 20, paddingTop: 10 },
  productTitle: { fontSize: 19, fontWeight: 'bold', color: '#222' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  metaSub: { fontSize: 12, color: '#888', flex: 1 },
  ratingBox: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: '#333', marginLeft: 3 },
  stockText: { fontSize: 12, color: '#888', marginTop: 4 },

  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, flexWrap: 'wrap' },
  currentPriceText: { fontSize: 20, fontWeight: 'bold', color: '#222', marginRight: 10 },
  oldPriceText: { fontSize: 13, color: '#AAA', textDecorationLine: 'line-through', marginRight: 8 },
  discountText: { fontSize: 13, color: '#4CAF50', fontWeight: 'bold' },
  mfrText: { fontSize: 12, color: '#999', marginTop: 4 },

  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 16 },

  qtyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qtyLabel: { fontSize: 14, fontWeight: '600', color: '#333' },
  qtyControl: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 20,
    paddingHorizontal: 4,
  },
  qtyBtn: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  qtyValue: { fontSize: 14, fontWeight: 'bold', color: '#333', width: 24, textAlign: 'center' },

  deliveryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 },
  checkBtn: {
    borderWidth: 1.5, borderColor: '#FF7043', borderRadius: 20,
    paddingHorizontal: 18, paddingVertical: 6,
  },
  checkBtnText: { color: '#FF7043', fontWeight: 'bold', fontSize: 12 },

  actionRow: { flexDirection: 'row', marginTop: 20 },
  askBtn: {
    flex: 1, height: 48, borderWidth: 1.5, borderColor: '#00A896',
    borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  askBtnText: { color: '#00A896', fontWeight: 'bold' },
  cartBtn: {
    flex: 1, height: 48, backgroundColor: '#FF7043',
    borderRadius: 24, justifyContent: 'center', alignItems: 'center',
  },
  cartBtnText: { color: 'white', fontWeight: 'bold' },

  accordionItem: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  accordionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16,
  },
  accordionTitle: { fontSize: 14, fontWeight: '600', color: '#333' },
  accordionContent: { fontSize: 13, color: '#777', lineHeight: 20, paddingBottom: 16 },
});