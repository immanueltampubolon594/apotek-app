<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Kategori;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Daftar 18 Kategori sesuai gambar kamu
        $categories = [
            "Women's Health", "Skin & Hair", "Child Specialist", 
            "Lungs and Breathing", "Dental Care", "Ear Nose Throat",
            "Homeopathy", "Bone and Joints", "Sex Specialist", 
            "Eye Specialist", "Digestive Issues", "Mental Wellness",
            "Heart", "Diabetes Management", "Brain and Nerves",
            "Urinary Issues", "Kidney Issues", "Ayurveda"
        ];

        foreach ($categories as $name) {
            Kategori::updateOrCreate(['nama' => $name]);
        }

        // Buat akun admin contoh jika belum ada
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            ['name' => 'Admin Apotek', 'password' => bcrypt('123456')]
        );
    }
}