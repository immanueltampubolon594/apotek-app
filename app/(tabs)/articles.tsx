import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Sidebar from '../../components/drawer/Sidebar';

const { width } = Dimensions.get('window');

export default function ArticlesScreen() {
  const router = useRouter();
  
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
 const [activeCat, setActiveCat] = useState('Eye');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://172.29.134.139:8000/api/articles');
      setArticles(res.data);
    } catch (e) {
      console.log("Gagal ambil artikel:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const topArticles = articles.filter(a => a.is_top);
  
  const recentPosts = articles.filter(a => {
    const matchCat = a.category === activeCat;
    const matchSearch = a.title.toLowerCase().includes(searchText.toLowerCase());
    return !a.is_top && matchCat && matchSearch;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 1. HEADER HIJAU */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Ionicons name="menu" size={28} color="white" />
        </TouchableOpacity>

        {isSearchActive ? (
          <TextInput 
            autoFocus
            placeholder="Search article..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        ) : (
          <Text style={styles.headerTitle}>Articles</Text>
        )}

        <TouchableOpacity onPress={() => {
          setIsSearchActive(!isSearchActive);
          if (isSearchActive) setSearchText('');
        }}>
          <Ionicons name={isSearchActive ? "close" : "search"} size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* 2. KATEGORI CHIPS — di luar ScrollView, tidak ikut scroll */}
 <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScrollWrapper} contentContainerStyle={styles.chipScroll}>   
    {[
  { name: 'Healthy Eating', color: '#00A896' },
  { name: 'Eye', color: '#7C4DFF' },
  { name: 'Vitamins', color: '#00BCD4' },
  { name: 'Dental', color: '#FF5722' },
  { name: 'Diabetes', color: '#FF9800' },
].map((cat, i) => (
  <TouchableOpacity 
    key={i} 
    style={[styles.chip, { backgroundColor: activeCat === cat.name ? cat.color : 'rgba(255,255,255,0.25)' }]}
    onPress={() => setActiveCat(cat.name)}
  >
    <Text style={[styles.chipText, activeCat === cat.name && { color: 'white' }]}>{cat.name}</Text>
  </TouchableOpacity>
))}
      </ScrollView>

      {/* 3. KONTEN UTAMA */}
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="#00A896" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* TOP ARTICLES */}
          {!isSearchActive && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Top Articles</Text>
                <TouchableOpacity onPress={fetchArticles}>
                  <Text style={styles.viewAll}>Refresh</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingLeft: 20}}>
                {topArticles.map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.topCard}
                    onPress={() => router.push({ pathname: '/articles/[id]', params: { id: item.id } } as any)}
                  >
                    <Image source={{ uri: item.image }} style={styles.topImg} />
                    <View style={styles.topInfo}>
                      <Text style={styles.authorRole}>{item.author_role}</Text>
                      <Text style={styles.articleTitle} numberOfLines={2}>{item.title}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          {/* RECENT POSTS */}
          <Text style={[styles.sectionTitle, {marginLeft: 20, marginTop: 25, marginBottom: 15}]}>
            {isSearchActive ? 'Search Results' : 'Recent Posts'}
          </Text>
          
          {recentPosts.length > 0 ? (
            recentPosts.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.recentCard}
                onPress={() => router.push({ pathname: '/articles/[id]', params: { id: item.id } } as any)}
              >
                <Image source={{ uri: item.image }} style={styles.recentImg} />
                <View style={styles.recentInfo}>
                  <Text style={styles.authorRole}>{item.author_role}</Text>
                  <Text style={styles.recentTitle}>{item.title}</Text>
                  <View style={styles.authorRow}>
                    <Image source={{ uri: item.author_avatar }} style={styles.avatarMini} />
                    <Text style={styles.authorName}>{item.author_name}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={60} color="#DDD" />
              <Text style={styles.emptyText}>No articles found in "{activeCat}"</Text>
            </View>
          )}

          <View style={{height: 100}} />
        </ScrollView>
      )}

      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    backgroundColor: '#00A896', 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    paddingBottom: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  searchInput: { flex: 1, marginHorizontal: 15, color: 'white', fontSize: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.5)' },
chipScrollWrapper: { backgroundColor: '#00A896', height: 55 },
chipScroll: { paddingLeft: 15, paddingRight: 20, paddingTop: 10 },
chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: 'rgba(255,255,255,0.25)' },
chipText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 15, marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  viewAll: { color: '#00A896', fontSize: 13, fontWeight: 'bold' },
  topCard: { width: width * 0.65, backgroundColor: 'white', borderRadius: 15, marginRight: 15, overflow: 'hidden', elevation: 3 },
  topImg: { width: '100%', height: 130 },
  topInfo: { padding: 12 },
  authorRole: { color: '#999', fontSize: 11, marginBottom: 5 },
  articleTitle: { fontWeight: 'bold', fontSize: 15 },
  recentCard: { flexDirection: 'row', backgroundColor: 'white', marginHorizontal: 20, marginBottom: 15, borderRadius: 15, padding: 12, elevation: 2 },
  recentImg: { width: 90, height: 90, borderRadius: 10 },
  recentInfo: { flex: 1, marginLeft: 15 },
  recentTitle: { fontWeight: 'bold', fontSize: 14, marginBottom: 8 },
  authorRow: { flexDirection: 'row', alignItems: 'center' },
  avatarMini: { width: 20, height: 20, borderRadius: 10, marginRight: 8 },
  authorName: { color: '#666', fontSize: 12 },
  emptyContainer: { alignItems: 'center', marginTop: 40, padding: 20 },
  emptyText: { color: '#AAA', marginTop: 10, fontSize: 15 }
});