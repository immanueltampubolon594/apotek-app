import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList, Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 20;

export default function CatalogScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Kalau dari halaman All Categories, params.category akan terisi
  // Kalau buka langsung dari tab, params.category kosong → default 'All Categories'
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>(
    (params.category as string) || 'All Categories'
  );

  const getObat = async (category: string) => {
    try {
      setLoading(true);
      const url =
        category === 'All Categories'
          ? 'http://172.29.134.139:8000/api/obat'
          : `http://172.29.134.139:8000/api/obat?category=${encodeURIComponent(category)}`;
      const response = await axios.get(url);
      setMedicines(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch ulang setiap kali activeCategory berubah
  useEffect(() => {
    getObat(activeCategory);
  }, [activeCategory]);

  // Sinkronkan kalau params berubah (misalnya buka dari kategori berbeda)
  useEffect(() => {
    if (params.category && params.category !== activeCategory) {
      setActiveCategory(params.category as string);
    }
  }, [params.category]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A896" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.greenHeader}>
        <View style={styles.headerTopRow}>
          {/* Tombol back muncul kalau buka dari kategori, tombol menu kalau dari tab */}
          {params.category ? (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <Ionicons name="menu-outline" size={28} color="white" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>
            {activeCategory === 'All Categories' ? 'Home' : activeCategory}
          </Text>
          <View style={styles.headerRightIcons}>
            <TouchableOpacity style={{ marginRight: 15 }}>
              <Ionicons name="search-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="cart-outline" size={24} color="white" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* QUICK FILTER — hanya tampil kalau buka dari tab (bukan dari kategori) */}
        {!params.category && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={{ paddingRight: 40 }}
          >
            {[
              { name: 'All Categories', icon: 'grid-outline', color: '#5C6BC0' },
              { name: 'Wellness', icon: 'woman-outline', color: '#EF5350' },
              { name: 'Ayurveda', icon: 'leaf-outline', color: '#66BB6A' },
              { name: 'Diabetes Management', icon: 'water-outline', color: '#42A5F5' },
              { name: 'Vitamins', icon: 'medkit-outline', color: '#FFA726' },
            ].map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryItem}
                onPress={() => setActiveCategory(cat.name)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
                  <Ionicons name={cat.icon as any} size={22} color="white" />
                </View>
                <Text style={[styles.categoryText, activeCategory === cat.name && styles.activeCategoryText]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* PRODUCT GRID */}
      {medicines.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={60} color="#CCC" />
          <Text style={styles.emptyText}>Tidak ada obat di kategori ini</Text>
        </View>
      ) : (
        <FlatList
          data={medicines}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isDiscount =
              item.harga_asli && parseFloat(item.harga_asli) > parseFloat(item.harga);

            return (
              <TouchableOpacity
                style={[styles.card, isDiscount && styles.cardDiscount]}
                onPress={() =>
                  router.push({ pathname: '/obat/[id]', params: { id: item.id } } as any)
                }
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
                  <Text style={styles.productSub} numberOfLines={1}>
                    {item.deskripsi || 'Sediaan Obat'}
                  </Text>

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
      )}

      <TouchableOpacity style={styles.floatingFilter}>
        <Ionicons name="options-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7F8' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#AAA', fontSize: 14, marginTop: 12 },

  greenHeader: {
    backgroundColor: '#00A896',
    paddingTop: 50,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: '700' },
  headerRightIcons: { flexDirection: 'row', alignItems: 'center' },
  cartBadge: {
    position: 'absolute', right: -6, top: -4,
    backgroundColor: '#FF8A65', borderRadius: 10,
    width: 18, height: 18,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#00A896',
  },
  cartBadgeText: { color: 'white', fontSize: 9, fontWeight: 'bold' },

  categoryScroll: { marginTop: 20, paddingLeft: 20 },
  categoryItem: { alignItems: 'center', marginRight: 22 },
  categoryIcon: {
    width: 50, height: 50, borderRadius: 25,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 8, elevation: 3,
  },
  categoryText: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  activeCategoryText: { color: 'white', fontWeight: 'bold' },

  listContainer: { paddingHorizontal: 10, paddingTop: 15, paddingBottom: 100 },
  card: {
    backgroundColor: 'white',
    width: cardWidth,
    margin: 6,
    borderRadius: 15,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 230,
  },
  cardDiscount: { borderColor: '#00A896' },
  heartIcon: { position: 'absolute', top: 10, right: 10, zIndex: 10 },
  saleBadge: {
    position: 'absolute', top: 0, left: 0,
    backgroundColor: '#FF8A65',
    paddingHorizontal: 10, paddingVertical: 4,
    borderTopLeftRadius: 15, borderBottomRightRadius: 10,
    zIndex: 10,
  },
  saleText: { color: 'white', fontSize: 10, fontWeight: 'bold' },

  imageWrapper: {
    width: '100%', height: 120,
    justifyContent: 'center', alignItems: 'center',
    marginTop: 15,
  },
  productImage: { width: '90%', height: '100%', resizeMode: 'contain' },

  productDetails: { marginTop: 8 },
  productName: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  productSub: { fontSize: 11, color: '#999', marginBottom: 8 },

  priceContainer: {
    marginTop: 'auto',
    paddingTop: 5,
    borderTopWidth: 0.5,
    borderTopColor: '#F0F0F0',
  },
  currentPrice: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  discountRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  strikePrice: { fontSize: 10, color: '#BBB', textDecorationLine: 'line-through' },
  percentText: { fontSize: 10, color: '#4CAF50', fontWeight: 'bold', marginLeft: 6 },

  floatingFilter: {
    position: 'absolute', bottom: 30, right: 20,
    backgroundColor: '#FF8A65',
    width: 55, height: 55, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    elevation: 8,
  },
});