<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    protected $fillable = ['nama'];

    public function obats()
    {
        return $this->hasMany(Obat::class);
    }
}