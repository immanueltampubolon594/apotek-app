<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('transaksis', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained(); // Siapa yang beli
        $table->decimal('total_harga', 12, 2);
        $table->string('metode_pembayaran');
        $table->string('status')->default('Menunggu Pembayaran');
        $table->json('items'); // Kita simpan daftar obatnya di sini dalam format JSON agar simpel
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksis');
    }
};
