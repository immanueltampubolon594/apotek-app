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
        Schema::create('reseps', function (Blueprint $table) {
            $table->id();
            // Menghubungkan resep ke user yang upload
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            // Menyimpan nama file/path foto resep
            $table->string('foto_resep');
            // Status resep (Menunggu, Diverifikasi, atau Ditolak)
            $table->string('status')->default('Menunggu Verifikasi');
            // Catatan tambahan dari user (Opsional)
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reseps');
    }
};