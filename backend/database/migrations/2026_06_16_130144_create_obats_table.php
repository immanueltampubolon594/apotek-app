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
    Schema::create('obats', function (Blueprint $table) {
        $table->id();
        // Menghubungkan ke tabel kategoris
        $table->foreignId('kategori_id')->constrained('kategoris')->onDelete('cascade'); 
        $table->string('nama');
        $table->decimal('harga', 12, 2); // Harga obat (contoh: 15500.00)
        $table->integer('stok');
        $table->text('deskripsi')->nullable();
        $table->string('foto')->nullable(); // Alamat link gambar obat
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('obats');
    }
};
