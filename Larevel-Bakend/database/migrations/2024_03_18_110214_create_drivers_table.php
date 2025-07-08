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
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->string('drive_name', 100);
            $table->string('driver_lname', 100);
            $table->string('driver_fname', 100);
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->string('nice_number', 100);
            $table->foreignId('permenant_prov_add')->references('id')->on('provinces');
            $table->foreignId('permenant_dis_add')->references('id')->on('districts');
            $table->string('permenant_village', 100);
            $table->foreignId('current_prov_add')->references('id')->on('provinces');
            $table->foreignId('current_dis_add')->references('id')->on('districts');
            $table->string('current_village', 100);
            $table->string('phone_number', 15)->unique();
            $table->text('description');
            $table->foreignId('car_id')->references('id')->on('cars');
            $table->foreignId('user_id')->references('id')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};
