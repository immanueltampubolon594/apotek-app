<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void {
    \App\Models\Faq::create([
        'pertanyaan' => 'Bagaimana cara upload resep?',
        'jawaban' => 'Klik tombol orange "Upload your Prescription" di halaman utama, lalu pilih foto resep dari galeri HP Anda.'
    ]);
    \App\Models\Faq::create([
        'pertanyaan' => 'Berapa lama proses pengiriman?',
        'jawaban' => 'Untuk pengiriman reguler memakan waktu 1-3 hari kerja tergantung lokasi Anda.'
    ]);
    }
}