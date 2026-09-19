import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

export default function ChatRoom() {
  const { id, name } = useLocalSearchParams(); 
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
const [aiTyping, setAiTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const fetchMessages = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`http://10.156.234.139:8000/api/chat/${user.id}/${id}`);
      setMessages(res.data);
    } catch (e) {
      console.log("Error fetch chat:", e);
    } finally {
      setLoading(false);
    }
  };
const sendMessage = async () => {
    if (input.trim() === '' || sending) return;
    setSending(true);
    const textToSend = input;
    setInput('');

    // Tampilkan pesan user langsung, tanpa nunggu server
    const tempMessage = {
      id: 'temp-' + Date.now(),
      sender_id: user.id,
      receiver_id: id,
      message: textToSend,
    };
    setMessages((prev) => [...prev, tempMessage]);

    const isAdminChat = name?.toString().toLowerCase().includes('admin');
    if (isAdminChat) setAiTyping(true);

    try {
      await axios.post('http://10.156.234.139:8000/api/chat/send', {
        sender_id: user.id,
        receiver_id: id,
        message: textToSend,
      });
      fetchMessages();
    } catch (e) {
      alert("Gagal mengirim pesan");
    } finally {
      setSending(false);
      setAiTyping(false);
    }
}

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); 
    return () => clearInterval(interval);
  }, [id]);

  return (
<KeyboardAvoidingView 
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
  keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 0}
  style={{flex: 1, backgroundColor: '#F8F9FA'}}
>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={26} color="white" /></TouchableOpacity>
        <View style={{flex:1, marginLeft: 15}}>
          <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>{name || 'Apoteker'}</Text>
          <Text style={{color:'rgba(255,255,255,0.7)', fontSize:12}}>Online</Text>
        </View>
      </View>

      {loading ? <ActivityIndicator style={{flex: 1}} color="#00A896" /> : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 20 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.sender_id === user.id ? styles.myBubble : styles.otherBubble]}>
              <Text style={[styles.msgText, item.sender_id === user.id && { color: 'white' }]}>{item.message}</Text>
            </View>
          )}
        />
      )}

{aiTyping && (
        <Text style={{ marginLeft: 20, marginBottom: 5, color: '#999', fontSize: 12 }}>
          Admin sedang mengetik...
        </Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput placeholder="Ketik pesan..." style={styles.textInput} value={input} onChangeText={setInput} />
<TouchableOpacity 
          style={[styles.sendBtn, sending && { opacity: 0.5 }]} 
          onPress={sendMessage} 
          disabled={sending}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: '#00A896', paddingTop: 60, paddingBottom: 15, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 18, marginBottom: 10 },
  myBubble: { alignSelf: 'flex-end', backgroundColor: '#00A896', borderBottomRightRadius: 2 },
  otherBubble: { alignSelf: 'flex-start', backgroundColor: 'white', borderBottomLeftRadius: 2 },
  msgText: { fontSize: 15 },
  inputContainer: { flexDirection: 'row', padding: 15, backgroundColor: 'white', alignItems: 'center', borderTopWidth: 1, borderColor: '#EEE' },
  textInput: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 10 },
  sendBtn: { backgroundColor: '#00A896', width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }
});