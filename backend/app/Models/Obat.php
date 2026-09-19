<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Obat extends Model
{
    use HasFactory;

    protected $fillable = ['kategori_id', 'nama', 'harga', 'harga_asli', 'stok', 'deskripsi', 'foto'];

    // INI PENTING: Hubungan ke tabel kategori
    public function kategori()
    {
        return $this->belongsTo(Kategori::class);
    }
}