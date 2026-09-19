<?php

namespace App\Http\Controllers;

use App\Models\Obat;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ObatController extends Controller
{
    /**
     * 1. Menampilkan semua obat (Dinamis sesuai IP saat ini)
     */
    public function index(Request $request)
    {
        $query = Obat::with('kategori');

        // Fitur Pencarian
        if ($request->has('search')) {
            $query->where('nama', 'like', '%' . $request->search . '%');
        }

        // Fitur Kategori
        if ($request->has('category') && $request->category != 'All') {
            $query->whereHas('kategori', function($q) use ($request) {
                $q->where('nama', $request->category);
            });
        }

        $obats = $query->get();

        // TRANSFORMASI FOTO: Membuat link foto otomatis mengikuti IP di .env
        $obats->map(function ($item) {
            if ($item->foto) {
                // Jika foto adalah path (bukan link luar), buatkan link lengkap
                if (!str_contains($item->foto, 'http')) {
                    $item->foto = asset('storage/' . $item->foto);
                }
            }
            return $item;
        });

        return response()->json($obats);
    }

    /**
     * 2. Menampilkan detail satu obat
     */
    public function show($id)
    {
        $obat = Obat::with('kategori')->find($id);
        if (!$obat) return response()->json(['message' => 'Obat tidak ditemukan'], 404);

        // Pastikan foto jadi link lengkap
        if ($obat->foto && !str_contains($obat->foto, 'http')) {
            $obat->foto = asset('storage/' . $obat->foto);
        }

        return response()->json($obat);
    }

    /**
     * 3. Simpan Obat Baru (Hanya simpan path, bukan link lengkap)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required',
            'harga' => 'required|numeric',
            'stok' => 'required|integer',
            'kategori_id' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($validator->fails()) return response()->json($validator->errors(), 422);

        try {
            // Simpan file ke folder: storage/app/public/obat
            $path = $request->file('image')->store('obat', 'public');

            $obat = Obat::create([
                'nama' => $request->nama,
                'harga' => $request->harga,
                'stok' => $request->stok,
                'deskripsi' => $request->deskripsi,
                'kategori_id' => $request->kategori_id,
                'foto' => $path, // SIMPAN PATH SAJA (Contoh: obat/abc.jpg)
            ]);

            return response()->json(['message' => 'Obat berhasil ditambahkan!', 'data' => $obat], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal simpan: ' . $e->getMessage()], 500);
        }
    }

    /**
     * 4. Hapus Obat (Nuclear Delete)
     */
    public function destroy($id)
    {
        try {
            $obat = Obat::find($id);
            if (!$obat) return response()->json(['message' => 'Obat tidak ditemukan'], 404);

            // Bersihkan hubungan di tabel lain
            DB::table('wishlists')->where('obat_id', $id)->delete();
            DB::table('transaksis')->where('items', 'like', '%"id":"'.$id.'"%')->delete();

            // Hapus file fisik di laptop
            if ($obat->foto) {
                Storage::disk('public')->delete($obat->foto);
            }

            $obat->delete();
            return response()->json(['message' => 'Obat berhasil dihapus!']);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal hapus: ' . $e->getMessage()], 500);
        }
    }

    /**
     * 5. Statistik Dashboard Admin
     */
    public function adminStats()
    {
        return response()->json([
            'pendapatan' => DB::table('transaksis')->where('status', 'Selesai')->sum('total_harga'),
            'pesanan' => DB::table('transaksis')->count(),
            'stok_kritis' => Obat::where('stok', '<', 10)->count(),
            'total_obat' => Obat::count(),
            'resep_pending' => DB::table('reseps')->where('status', 'Menunggu Verifikasi')->count()
        ]);
    }
}