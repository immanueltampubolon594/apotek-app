import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, FlatList, Image, 
  TouchableOpacity, Dimensions, ActivityIndicator, ScrollView, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 20; 

export default function CatalogScreen() {
  const router = useRouter();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All Categories');

  const getObat = async () => {
    try {
      setLoading(true);
      // Ganti IP sesuai server backend kamu
      const response = await axios.get('http://10.156.234.139:8000/api/obat'); 
      setMedicines(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getObat();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A896" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00A896" />
      
      {/* 1. HEADER HIJAU */}
      <View style={styles.greenHeader}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity><Ionicons name="menu-outline" size={28} color="white" /></TouchableOpacity>
          <Text style={styles.headerTitle}>Home</Text>
          <View style={styles.headerRightIcons}>
            <TouchableOpacity style={{marginRight: 15}}><Ionicons name="search-outline" size={24} color="white" /></TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="cart-outline" size={24} color="white" />
              <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>3</Text></View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. CATEGORY BUBBLES */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={{paddingRight: 40}}>
          {[
           { name: 'Women\'s Health', icon: null, color: '#FF5252', image: require('../../assets/images/Wellness.png') },
{ name: 'Skin & Hair', icon: null, color: '#4CAF50', image: require('../../assets/images/Ayurveda.png') },
{ name: 'Child Specialist', icon: null, color: '#2196F3', image: require('../../assets/images/Diabetes.png') },
{ name: 'Dental Care', icon: null, color: '#FF9800', image: require('../../assets/images/Vitamins.png') },
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
      </View>

      {/* 3. PRODUCT GRID */}
      <FlatList
        data={medicines}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push({ pathname: '/obat/[id]', params: { id: item.id } } as any)}
          >
            {/* Wishlist Heart - Pojok Kanan Atas */}
            <TouchableOpacity style={styles.heartIcon}>
              <Ionicons name="heart-outline" size={20} color="#CCC" />
            </TouchableOpacity>

            {/* SALE BADGE - Pojok Kiri Atas (WAJIB ADA) */}
            <View style={styles.saleBadge}>
              <Text style={styles.saleText}>Sale</Text>
            </View>

            {/* Image Wrapper */}
            <View style={styles.imageWrapper}>
                <Image source={{ uri: item.foto }} style={styles.productImage} />
            </View>
            
            <View style={styles.productDetails}>
              <Text style={styles.productName} numberOfLines={1}>{item.nama}</Text>
              <Text style={styles.productSub} numberOfLines={1}>{item.deskripsi || 'Sediaan Obat'}</Text>
              
              <View style={styles.priceContainer}>
                {/* HARGA CORET / MRP (WAJIB ADA) */}
                <View style={styles.oldPriceRow}>
                    <Text style={styles.oldPrice}>Rp {(Number(item.harga) * 1.2).toLocaleString('id-ID')}</Text>
                    <Text style={styles.discountPercent}>20% OFF</Text>
                </View>

                {/* HARGA UTAMA */}
                <Text style={styles.currentPrice}>Rp {Number(item.harga).toLocaleString('id-ID')}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Floating Filter Button */}
      <TouchableOpacity style={styles.floatingFilter}>
        <Ionicons name="options-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  greenHeader: { 
    backgroundColor: '#00A896', 
    paddingTop: 50, paddingBottom: 25,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
    elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10
  },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  headerRightIcons: { flexDirection: 'row', alignItems: 'center' },
  cartBadge: { position: 'absolute', right: -6, top: -4, backgroundColor: '#FF7043', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#00A896' },
  cartBadgeText: { color: 'white', fontSize: 9, fontWeight: 'bold' },

  categoryScroll: { marginTop: 20, paddingLeft: 20 },
  categoryItem: { alignItems: 'center', marginRight: 22 },
  categoryIcon: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginBottom: 8, elevation: 4 },
  categoryText: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  activeCategoryText: { color: 'white', fontWeight: 'bold' },

  listContainer: { paddingHorizontal: 10, paddingTop: 15, paddingBottom: 100 },
  
  card: { 
    backgroundColor: 'white', 
    width: cardWidth, 
    margin: 6, 
    borderRadius: 15, 
    padding: 12,
    elevation: 4,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5,
    minHeight: 250, // Mengunci tinggi agar card seragam
  },
  heartIcon: { position: 'absolute', top: 12, right: 12, zIndex: 10 },
  
  // STYLE SALE BADGE (Ini yang membuat card terlihat "pas")
  saleBadge: { 
    position: 'absolute', top: 0, left: 0, 
    backgroundColor: '#FF7043', paddingHorizontal: 12, paddingVertical: 5, 
    borderTopLeftRadius: 15, borderBottomRightRadius: 12, zIndex: 10 
  },
  saleText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  
  imageWrapper: {
    width: '100%', height: 110,
    justifyContent: 'center', alignItems: 'center',
    marginTop: 15,
  },
  productImage: { width: '100%', height: '100%', resizeMode: 'contain' },

  productDetails: { marginTop: 12 },
  productName: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  productSub: { fontSize: 10, color: '#999', marginTop: 2, height: 15 },
  
  priceContainer: { 
    marginTop: 10, borderTopWidth: 0.5, borderTopColor: '#F0F0F0', paddingTop: 8 
  },
  
  // STYLE HARGA CORET
  oldPriceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  oldPrice: { fontSize: 10, color: '#BBB', textDecorationLine: 'line-through' },
  discountPercent: { fontSize: 10, color: '#4CAF50', fontWeight: 'bold', marginLeft: 8 },
  
  currentPrice: { fontSize: 16, fontWeight: 'bold', color: '#333' },

  floatingFilter: { 
    position: 'absolute', bottom: 30, right: 20, 
    backgroundColor: '#FF7043', width: 60, height: 60, borderRadius: 30, 
    justifyContent: 'center', alignItems: 'center', elevation: 10 
  }
});