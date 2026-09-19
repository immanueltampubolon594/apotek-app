import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FilterModal({ visible, onClose }: any) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          
          {/* HEADER HIJAU (Sesuai Gambar) */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}><Text style={styles.headerBtnText}>Cancel</Text></TouchableOpacity>
            <Text style={styles.headerTitle}>Filters By</Text>
            <TouchableOpacity><Text style={styles.headerBtnText}>Reset</Text></TouchableOpacity>
          </View>

          <ScrollView style={styles.body}>
            {/* 1. PRODUCT TYPE */}
            <Text style={styles.sectionTitle}>Product Type</Text>
            <View style={styles.gridRow}>
              {[
                { name: 'All', active: false },
                { name: 'Rx Medicine', active: true },
                { name: 'Tablets', active: false },
                { name: 'Syrup', active: false },
                { name: 'Vitamins', active: false },
                { name: 'Dilution', active: false },
              ].map((item, i) => (
                <View key={i} style={styles.radioItem}>
                  <Ionicons 
                    name={item.active ? "radio-button-on" : "radio-button-off"} 
                    size={20} 
                    color={item.active ? "#FF7043" : "#CCC"} 
                  />
                  <Text style={[styles.radioText, item.active && {color: '#FF7043'}]}>{item.name}</Text>
                </View>
              ))}
            </View>

            {/* 2. BRANDS */}
            <Text style={styles.sectionTitle}>Brands</Text>
            <View style={styles.chipRow}>
              {['Dabur', 'Yuvika', 'Vitro Naturals', 'Balu Herbals', 'Basic Ayurveda', 'Kapiva'].map((brand) => (
                <View key={brand} style={[styles.chip, brand === 'Dabur' && styles.chipActive]}>
                  <Text style={[styles.chipText, brand === 'Dabur' && {color: 'white'}]}>{brand}</Text>
                </View>
              ))}
            </View>

            {/* 3. RATING */}
            <Text style={styles.sectionTitle}>Rating</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                <Ionicons name="star" size={24} color="#FFAD33" />
                <Ionicons name="star" size={24} color="#FFAD33" />
                <Ionicons name="star" size={24} color="#FFAD33" />
                <Ionicons name="star" size={24} color="#FFAD33" />
                <Ionicons name="star" size={24} color="#CCC" />
                <Text style={{marginLeft: 15, color: '#666'}}>4.0 Star</Text>
            </View>

            {/* 4. SORT BY */}
            <Text style={styles.sectionTitle}>Sort by</Text>
            {['Most Popular', 'Cost Low to High', 'Cost High to Low'].map((sort) => (
              <View key={sort} style={styles.sortItem}>
                <Text style={[styles.sortText, sort === 'Cost Low to High' && {color: '#FF7043'}]}>{sort}</Text>
                {sort === 'Cost Low to High' && <Ionicons name="checkmark" size={20} color="#FF7043" />}
              </View>
            ))}

            {/* 5. DISCOUNT */}
            <Text style={styles.sectionTitle}>Discount</Text>
            <View style={styles.discountRow}>
              {['20%', '30%', '40%', '50%'].map((disc) => (
                <View key={disc} style={[styles.discBox, disc === '30%' && styles.discBoxActive]}>
                  <Text style={[styles.discText, disc === '30%' && {color: 'white'}]}>{disc}</Text>
                </View>
              ))}
            </View>

            {/* TOMBOL APPLY */}
            <TouchableOpacity style={styles.applyBtn} onPress={onClose}>
              <Text style={styles.applyBtnText}>Apply Filter</Text>
            </TouchableOpacity>

            <View style={{height: 50}} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25, height: '90%' },
  header: { backgroundColor: '#00A896', flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderTopLeftRadius: 25, borderTopRightRadius: 25, alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  headerBtnText: { color: 'white', fontSize: 14 },
  body: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#000' },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap' },
  radioItem: { flexDirection: 'row', alignItems: 'center', width: '33%', marginBottom: 15 },
  radioText: { marginLeft: 8, fontSize: 13, color: '#666' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F2F2F2', marginRight: 10, marginBottom: 10 },
  chipActive: { backgroundColor: '#FF7043' },
  chipText: { fontSize: 12, color: '#666' },
  sortItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#EEE' },
  sortText: { fontSize: 14, color: '#444' },
  discountRow: { flexDirection: 'row', justifyContent: 'space-between' },
  discBox: { width: '22%', paddingVertical: 10, alignItems: 'center', borderRadius: 15, borderWidth: 1, borderColor: '#EEE' },
  discBoxActive: { backgroundColor: '#FF7043', borderColor: '#FF7043' },
  discText: { fontWeight: 'bold', color: '#666' },
  applyBtn: { backgroundColor: '#00A896', padding: 18, borderRadius: 30, alignItems: 'center', marginTop: 40 },
  applyBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});