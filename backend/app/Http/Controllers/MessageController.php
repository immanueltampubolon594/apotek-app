<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http; // Wajib untuk panggil AI

class MessageController extends Controller
{
    /**
     * 1. AMBIL PERCAKAPAN (Room Chat)
     */
    public function getChat($user1, $user2)
    {
        // Tandai pesan sebagai 'read' jika saya adalah penerima
        Message::where('receiver_id', $user1)
                ->where('sender_id', $user2)
                ->where('is_read', false)
                ->update(['is_read' => true]);

        return response()->json(
            Message::where(function($q) use ($user1, $user2) {
                $q->where('sender_id', $user1)->where('receiver_id', $user2);
            })->orWhere(function($q) use ($user1, $user2) {
                $q->where('sender_id', $user2)->where('receiver_id', $user1);
            })
            ->orderBy('created_at', 'asc')
            ->get()
        );
    }

    /**
     * 2. KIRIM PESAN & BALASAN OTOMATIS AI
     */
    public function send(Request $request)
    {
        $request->validate([
            'sender_id' => 'required',
            'receiver_id' => 'required',
            'message' => 'required'
        ]);

        // A. Simpan pesan dari User ke Database
        $msg = Message::create([
            'sender_id' => $request->sender_id,
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
            'is_read' => false
        ]);

        // B. LOGIKA AI: Jika penerima pesan adalah ADMIN (ID: 1)
        // Pastikan di phpMyAdmin, ID Admin Apotek kamu adalah 1
        if ($request->receiver_id == 1) {
            try {
                // Panggil Server Python AI (Jalan di port 5000)
                $response = Http::timeout(30)->post('http://127.0.0.1:5000/tanya-apoteker', [
                    'pesan' => $request->message
                ]);

                if ($response->successful()) {
                    $aiJawaban = $response->json()['jawaban'];

                    // C. Simpan Jawaban AI sebagai pesan dari Admin (ID 1) ke User
                    Message::create([
                        'sender_id' => 1, // Pengirimnya Admin
                        'receiver_id' => $request->sender_id, // Penerimanya user tadi
                        'message' => $aiJawaban,
                        'is_read' => false
                    ]);
                }
            } catch (\Exception $e) {
                // Jika AI gagal, tidak apa-apa, pesan user tetap tersimpan
                \Log::error("Gagal panggil AI: " . $e->getMessage());
            }
        }

        return response()->json($msg, 201);
    }

    /**
     * 3. AMBIL DAFTAR TEMAN CHAT (Dinamis + Notifikasi)
     */
    public function getChatPartners($my_id)
    {
        $users = User::where('id', '!=', $my_id)->get();

        foreach ($users as $user) {
            // Hitung pesan belum dibaca
            $user->unread_count = Message::where('sender_id', $user->id)
                                        ->where('receiver_id', $my_id)
                                        ->where('is_read', false)
                                        ->count();
            
            // Ambil pesan terakhir
            $lastMsg = Message::where(function($q) use ($my_id, $user) {
                $q->where('sender_id', $my_id)->where('receiver_id', $user->id);
            })->orWhere(function($q) use ($my_id, $user) {
                $q->where('sender_id', $user->id)->where('receiver_id', $my_id);
            })->orderBy('created_at', 'desc')->first();

            $user->last_message = $lastMsg ? $lastMsg->message : 'Belum ada pesan';
        }

        return response()->json($users);
    }
}