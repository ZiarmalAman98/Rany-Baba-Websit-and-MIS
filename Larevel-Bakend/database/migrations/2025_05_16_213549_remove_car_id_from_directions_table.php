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
        Schema::table('directions', function (Blueprint $table) {
            $table->dropForeign(['car_id']); // که foreign key وي
            $table->dropColumn('car_id');
        });
    }

    public function down(): void
    {
        Schema::table('directions', function (Blueprint $table) {
            $table->foreignId('car_id')->constrained()->onDelete('cascade');
        });
    }
};
