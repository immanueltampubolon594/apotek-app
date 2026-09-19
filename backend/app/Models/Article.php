<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    // Daftar kolom yang boleh diisi
    protected $fillable = [
        'title', 
        'category', 
        'author_name', 
        'author_role', 
        'author_avatar', 
        'image', 
        'is_top'
    ];
}