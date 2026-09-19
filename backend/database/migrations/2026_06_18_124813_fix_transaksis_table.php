<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transaksis', function (Blueprint $table) {
            // Menambahkan kolom yang hilang jika belum ada
            if (!Schema::hasColumn('transaksis', 'kode_transaksi')) {
                $table->string('kode_transaksi')->unique()->after('id');
            }
            if (!Schema::hasColumn('transaksis', 'alamat_tujuan')) {
                $table->text('alamat_tujuan')->nullable()->after('metode_pembayaran');
            }
            if (!Schema::hasColumn('transaksis', 'snap_token')) {
                $table->string('snap_token')->nullable()->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('transaksis', function (Blueprint $table) {
            $table->dropColumn(['kode_transaksi', 'alamat_tujuan', 'snap_token']);
        });
    }
};