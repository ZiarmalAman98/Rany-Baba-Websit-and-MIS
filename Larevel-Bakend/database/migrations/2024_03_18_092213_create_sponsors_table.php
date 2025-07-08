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
        Schema::create('sponsors', function (Blueprint $table) {
            $table->id();
            $table->string('sponser_name', 100);
            $table->string('sponsor_fname', 100);
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->foreignId('permenant_prov_add')->references('id')->on('provinces');
            $table->foreignId('permenant_dis_add')->references('id')->on('districts');
            $table->string('permenant_village', 100);
            $table->foreignId('current_prov_add')->references('id')->on('provinces');
            $table->foreignId('current_dis_add')->references('id')->on('districts');
            $table->string('current_village', 100);
            $table->string('phone_number', 15)->unique();
            $table->text('approval_barharli');
            $table->string('sponsor_image')->nullable();
            $table->foreignId('owner_id')->references('id')->on('owners');
            $table->foreignId('user_id')->references('id')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sponsors');
    }
};
