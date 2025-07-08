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
        Schema::create('owners', function (Blueprint $table) {
            $table->id();
            $table->string('name', 60);
            $table->string('last_name', 60);
            $table->string('father_name', 60);
            $table->string('grand_fname', 60);
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->foreignId('permenant_prov_add')->references('id')->on('provinces');
            $table->foreignId('permenant_dist_add')->references('id')->on('districts');
            $table->string('permenant_village', 100);
            $table->foreignId('current_prov_add')->references('id')->on('provinces');
            $table->foreignId('current_dist_add')->references('id')->on('districts');
            $table->string('current_village', 100);
            $table->string('owner_job', 100);
            $table->string('job_place', 100);
            $table->string('nic_number', 100)->unique();
            $table->string('phone_number', 15)->unique();
            $table->string('house_no');
            $table->string('image', 255);
            $table->text('description');
            $table->foreignId('user_id')->references('id')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('owners');
    }
};
