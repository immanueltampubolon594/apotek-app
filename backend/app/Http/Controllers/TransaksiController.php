<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Obat;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;

class TransaksiController extends Controller
{
    /**
     * 1. FUNGSI STORE: Membuat Pesanan & Memunculkan QRIS/DANA
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'user_name' => 'required',
            'user_email' => 'required|email',
            'alamat_tujuan' => 'required',
            'items' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Data tidak valid', 'errors' => $validator->errors()], 422);
        }

        $orderId = 'INV-' . time() . '-' . $request->user_id;
        $serverKey = env('MIDTRANS_SERVER_KEY');
        
        // KITA SET HARGA TESTING 5000 AGAR QRIS & DANA MUNCUL
     $hargaTest = $request->total_harga < 10000 ? 10000 : $request->total_harga;

        try {
            return DB::transaction(function () use ($request, $orderId, $serverKey, $hargaTest) {
                
                // A. Simpan ke database lokal
                $idTransaksi = DB::table('transaksis')->insertGetId([
                    'user_id' => $request->user_id,
                    'kode_transaksi' => $orderId,
                    'total_harga' => $hargaTest, // Simpan 5000 ke database
                    'metode_pembayaran' => 'Midtrans',
                    'alamat_tujuan' => $request->alamat_tujuan,
                    'items' => json_encode($request->items),
                    'status' => 'Pending',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // B. Panggil API Midtrans (Bypass SSL & Timeout)
                $response = Http::withBasicAuth($serverKey, '')
                    ->withoutVerifying() 
                    ->withOptions([
                        'connect_timeout' => 30, 
                        'timeout' => 60,
                        'curl' => [CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4],
                    ])
                    ->post('https://app.sandbox.midtrans.com/snap/v1/transactions', [
                        'transaction_details' => [
                            'order_id' => $orderId,
                            'gross_amount' => $hargaTest, // Kirim 5000 ke Midtrans
                        ],
                        'customer_details' => [
                            'first_name' => $request->user_name,
                            'email' => $request->user_email,
                        ],
                       'enabled_payments' => [
    'other_qris',
    'gopay',
    'shopeepay',
    'dana',
    'bank_transfer'
],
'other_qris' => [
    'acquirer' => 'gopay'
],
                    ]);

                if ($response->successful()) {
                    $result = $response->json();
                    return response()->json([
                        'message' => 'Transaksi berhasil dibuat',
                        'payment_url' => $result['redirect_url'],
                        'kode_transaksi' => $orderId,
                        'id' => $idTransaksi
                    ], 201);
                } else {
                    throw new \Exception("Midtrans Error: " . $response->body());
                }
            });

        } catch (\Exception $e) {
            return response()->json(['message' => 'Error Server: ' . $e->getMessage()], 500);
        }
    }

    /**
     * 2. FUNGSI CALLBACK (LUNAS OTOMATIS)
     */
    public function callback(Request $request)
    {
        $serverKey = env('MIDTRANS_SERVER_KEY');
        // Gunakan gross_amount dari request midtrans untuk verifikasi signature
        $hashed = hash("sha512", $request->order_id . $request->status_code . $request->gross_amount . $serverKey);

        if ($hashed == $request->signature_key) {
            if ($request->transaction_status == 'capture' || $request->transaction_status == 'settlement') {
                
                $order = DB::table('transaksis')->where('kode_transaksi', $request->order_id)->first();
                
                if ($order && $order->status !== 'Selesai') {
                    DB::table('transaksis')->where('kode_transaksi', $request->order_id)->update([
                        'status' => 'Selesai',
                        'updated_at' => now()
                    ]);

                    // Potong Stok
                    $items = json_decode($order->items, true);
                    foreach ($items as $item) {
                        $obat = Obat::find($item['id']);
                        if ($obat) {
                            $obat->stok -= $item['quantity'];
                            $obat->save();
                        }
                    }
                }
            }
        }
        return response()->json(['status' => 'OK']);
    }

    public function index($user_id)
    {
        $orders = DB::table('transaksis')->where('user_id', $user_id)->orderBy('created_at', 'desc')->get();
        foreach ($orders as $order) {
            $order->items = json_decode($order->items);
        }
        return response()->json($orders);
    }

    public function show($id)
    {
        $order = DB::table('transaksis')->where('id', $id)->first();
        if (!$order) return response()->json(['message' => 'Not Found'], 404);
        $order->items = json_decode($order->items);
        return response()->json($order);
    }
}   