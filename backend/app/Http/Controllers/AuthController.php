<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // 1. Validasi
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi Gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        // 2. Simpan
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            return response()->json([
                'message' => 'Registrasi Berhasil',
                'user' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal simpan ke database',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Email atau Password Salah'], 401);
        }

        return response()->json(['message' => 'Login Berhasil', 'user' => $user]);
    }
    public function updateProfile(Request $request, $id)
{
    $user = User::find($id);
    if (!$user) return response()->json(['message' => 'User tidak ditemukan'], 404);

    $user->name = $request->name;
    // Jika password diisi, maka ubah passwordnya
    if ($request->password) {
        $user->password = Hash::make($request->password);
    }
    $user->save();

    return response()->json(['message' => 'Profil berhasil diperbarui', 'user' => $user]);
}
}