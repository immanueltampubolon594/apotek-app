<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;

// Import Semua Controller
use App\Http\Controllers\ObatController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\ResepController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ArticleController;

// Import Semua Model
use App\Models\Faq;
use App\Models\Article;
use App\Models\Kategori;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| API Routes - Apotek Century Project
|--------------------------------------------------------------------------
*/

// --- 1. OTENTIKASI & PROFIL ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::put('/update-profile/{id}', [AuthController::class, 'updateProfile']);

// --- 2. DATA OBAT & KATEGORI ---
Route::get('/obat', [ObatController::class, 'index']);           
Route::get('/obat/{id}', [ObatController::class, 'show']);       
Route::post('/obat-admin', [ObatController::class, 'store']);    
Route::delete('/obat/{id}', [ObatController::class, 'destroy']); // SEKARANG SUDAH DI LUAR & BENAR
Route::get('/kategori-list', function() {                        
    return response()->json(Kategori::all());
});

// --- 3. TRANSAKSI & PEMBAYARAN ---
Route::post('/transaksi', [TransaksiController::class, 'store']);            
Route::get('/transaksi/{user_id}', [TransaksiController::class, 'index']);    
Route::get('/transaksi-detail/{id}', [TransaksiController::class, 'show']);   
Route::post('/midtrans-callback', [TransaksiController::class, 'callback']);  

// --- 4. RESEP DOKTER ---
Route::post('/upload-resep', [ResepController::class, 'upload']);
Route::get('/my-reseps/{userId}', [ResepController::class, 'getUserReseps']);

// --- 5. FITUR PENDUKUNG (ALAMAT, PAYMENT, WISHLIST) ---
Route::get('/alamat/{user_id}', [AddressController::class, 'index']);
Route::post('/alamat', [AddressController::class, 'store']);
Route::delete('/alamat/{id}', [AddressController::class, 'destroy']);

Route::get('/payments/{user_id}', [PaymentController::class, 'index']);
Route::post('/payments', [PaymentController::class, 'store']);
Route::delete('/payments/{id}', [PaymentController::class, 'destroy']);

Route::get('/wishlist/{user_id}', [WishlistController::class, 'index']);
Route::post('/wishlist', [WishlistController::class, 'store']);
Route::delete('/wishlist/{id}', [WishlistController::class, 'destroy']);

// --- 6. SISTEM CHAT ---
Route::get('/chat-partners/{my_id}', [MessageController::class, 'getChatPartners']);
Route::get('/chat/{user1}/{user2}', [MessageController::class, 'getChat']);
Route::post('/chat/send', [MessageController::class, 'send']);

// --- 7. INFORMASI STATIS ---
Route::get('/faqs', function() { return response()->json(Faq::all()); });
Route::get('/articles', function() { return response()->json(Article::all()); });
Route::get('/articles/{id}', function ($id) {
    $article = Article::find($id);
    return $article ? response()->json($article) : response()->json(['message' => 'Not Found'], 404);
});

// --- 8. DASHBOARD ADMIN ---
Route::get('/admin/stats', [ObatController::class, 'adminStats']);

// --- 9. AI SERVICE ---
Route::post('/ai/cek-keamanan', function(Request $request) {
    try {
        $response = Http::timeout(60)->post('http://127.0.0.1:5000/cek-interaksi', [
            'obat1' => $request->obat1,
            'obat2' => $request->obat2,
        ]);
        return $response->json();
    } catch (\Exception $e) {
        return response()->json(['status' => 'Error', 'pesan' => 'Gagal terhubung ke AI'], 500);
    }
});

Route::post('/articles-admin', [ArticleController::class, 'store']);

Route::delete('/articles/{id}', function ($id) {
    \App\Models\Article::destroy($id);
    return response()->json(['message' => 'Deleted']);
});