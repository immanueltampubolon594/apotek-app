import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useCartStore } from '../../store/cartStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const router = useRouter();

  // Hitung Total Harga
  const subtotal = items.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER HIJAU */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={26} color="white" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <TouchableOpacity><Ionicons name="cart-outline" size={26} color="white" /></TouchableOpacity>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.itemCount}>{items.length} Items in your Cart</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/two' as any)}><Text style={styles.addMore}>+ Add more Items</Text></TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartCard}>
            <Image source={{ uri: item.image }} style={styles.img} />
            <View style={{ flex: 1, marginLeft: 15 }}>
              <View style={styles.rowBetween}>
                <Text style={styles.name}>{item.name}</Text>
                <TouchableOpacity onPress={() => removeItem(item.id)}><Ionicons name="trash-outline" size={20} color="#FF7043" /></TouchableOpacity>
              </View>
              <Text style={styles.subName}>Bottle of 150ml Oral Suspension</Text>
              <View style={[styles.rowBetween, { marginTop: 10 }]}>
                <Text style={styles.price}>Rp {item.price.toLocaleString()}</Text>
                <View style={styles.qtyRow}>
                  {/* FUNGSI DECREASE */}
                  <TouchableOpacity onPress={() => updateQuantity(item.id, 'decrease')} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>-</Text></TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  {/* FUNGSI INCREASE */}
                  <TouchableOpacity onPress={() => updateQuantity(item.id, 'increase')} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>+</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{textAlign:'center', marginTop: 50, color:'#999'}}>Keranjang kosong</Text>}
      />

      {/* SUMMARY */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>PAYMENT SUMMARY</Text>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Order Total</Text><Text style={styles.summaryVal}>Rp {subtotal.toLocaleString()}</Text></View>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Items Discount</Text><Text style={styles.summaryVal}>-Rp 0</Text></View>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Shipping</Text><Text style={styles.summaryVal}>Free</Text></View>
        
        <View style={styles.couponBox}>
            <Ionicons name="pricetag-outline" size={18} color="#999" />
            <Text style={{flex:1, marginLeft: 10, fontSize:12, color:'#666'}}>You saved Rp 0 on the order</Text>
            <Text style={{color:'#00A896', fontWeight:'bold'}}>Edit coupon</Text>
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View>
            <Text style={{color:'#999', fontSize:11, fontWeight:'bold'}}>TOTAL</Text>
            <Text style={styles.totalPrice}>Rp {subtotal.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push('/transaksi/bayar' as any)}>
          <Text style={styles.checkoutText}>Checkout</Text>
          <Ionicons name="chevron-forward-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { backgroundColor: '#00A896', paddingTop: 60, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  itemCount: { color: '#999', fontWeight: '500' },
  addMore: { color: '#00A896', fontWeight: 'bold' },
  cartCard: { flexDirection: 'row', padding: 20, borderBottomWidth: 1, borderColor: '#F5F5F5', alignItems: 'center' },
  img: { width: 70, height: 70, resizeMode: 'contain' },
  name: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  subName: { color: '#999', fontSize: 12, marginTop: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E0F2F1', justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { color: '#00A896', fontSize: 20, fontWeight: 'bold' },
  qtyText: { marginHorizontal: 15, fontWeight: 'bold', fontSize: 16 },
  summaryContainer: { padding: 25, backgroundColor: '#F9F9F9' },
  summaryTitle: { fontWeight: 'bold', marginBottom: 15, color: '#333' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { color: '#666' },
  summaryVal: { fontWeight: 'bold', color: '#333' },
  couponBox: { flexDirection: 'row', borderWidth: 1, borderStyle:'dashed', borderColor:'#CCC', padding:12, marginTop:10, alignItems:'center', borderRadius: 10 },
  footer: { padding: 20, paddingBottom: 35, borderTopWidth: 1, borderColor: '#EEE', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalPrice: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  checkoutBtn: { backgroundColor: '#00A896', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 30, flexDirection: 'row', alignItems: 'center', elevation: 5 },
  checkoutText: { color: 'white', fontWeight: 'bold', marginRight: 10, fontSize: 16 }
});