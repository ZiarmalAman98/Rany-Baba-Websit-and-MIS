<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Owner; // ✅ دلته مو Owner امپورټ کړ

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Owner::create([
            'name' => 'Ali',
            'last_name' => 'Rahman',
            'father_name' => 'Khalid',
            'grand_fname' => 'Hassan',
            'permenant_prov_add' => 1,
            'permenant_dist_add' => 1,
            'permenant_village' => 'Test Village',
            'current_prov_add' => 2,
            'current_dist_add' => 2,
            'current_village' => 'Test City',
            'owner_job' => 'Engineer',
            'job_place' => 'Company',
            'nic_number' => '9876543210123',
            'phone_number' => '0799123456',
            'house_no' => '101',
            'image' => 'default.jpg',
            'description' => 'Seeder Data',
            'user_id' => 1
        ]);
    }
}
