<?php

namespace App\Http\Controllers;

use App\Models\Resep;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ResepController extends Controller
{
    /**
     * Fungsi untuk mengunggah foto resep dari HP
     */
    public function upload(Request $request)
    {
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'image'   => 'required|image|mimes:jpeg,png,jpg|max:2048', // Max 2MB
            'catatan' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            // 2. Proses Simpan Gambar ke folder: storage/app/public/reseps
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('reseps', $filename, 'public');

                // 3. Simpan data ke Database
                $resep = Resep::create([
                    'user_id'    => $request->user_id,
                    'foto_resep' => $path,
                    'status'     => 'Menunggu Verifikasi',
                    'catatan'    => $request->catatan
                ]);

                return response()->json([
                    'message' => 'Resep berhasil diunggah',
                    'data'    => $resep,
                    'url'     => asset('storage/' . $path) // Link foto untuk ditampilkan di HP
                ], 201);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan server',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menampilkan daftar resep milik user tertentu
     */
    public function getUserReseps($userId)
    {
        $reseps = Resep::where('user_id', $userId)->orderBy('created_at', 'desc')->get();
        
        // Tambahkan link URL foto ke setiap data
        $reseps->map(function ($item) {
            $item->foto_url = asset('storage/' . $item->foto_resep);
            return $item;
        });

        return response()->json($reseps);
    }
}