<?php
namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller {
    // Lihat daftar wishlist user
    public function index($user_id) {
        $wishlist = Wishlist::with('obat')->where('user_id', $user_id)->get();
        return response()->json($wishlist);
    }

    // Tambah ke wishlist
    public function store(Request $request) {
        // Cek dulu apakah sudah ada di wishlist
        $exists = Wishlist::where('user_id', $request->user_id)
                          ->where('obat_id', $request->obat_id)->first();
        
        if ($exists) {
            return response()->json(['message' => 'Sudah ada di wishlist'], 200);
        }

        $wish = Wishlist::create($request->all());
        return response()->json($wish, 201);
    }

    // Hapus dari wishlist
    public function destroy($id) {
        Wishlist::destroy($id);
        return response()->json(['message' => 'Dihapus dari wishlist']);
    }
}