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
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('plate_no')->unique();
            $table->string('company_name');
            $table->date('create_date');
            $table->foreignId('direction_id')->constrained('directions');
            $table->string('shase_no')->unique();
            $table->string('Engine_no')->unique();
            $table->string('oil_type');
            $table->string('car_color');
            $table->string('create_county');
            $table->date('sale_date')->nullable();
            $table->string('saler_info')->nullable();
            $table->foreignId('change_add')->nullable()->constrained('directions');
            $table->foreignId('owner_id')->constrained('owners');
            $table->text('description')->nullable();
            $table->foreignId('user_id')->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
