<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Owner extends Model
{
    use HasFactory;

   protected $fillable = [
    'id', // if owner_code is assigned to 'id'
    'name',
    'last_name',
    'father_name',
    'grand_fname',
    'gender',
    'permenant_prov_add',
    'permenant_dist_add',
    'permenant_village',
    'current_prov_add',
    'current_dist_add',
    'current_village',
    'owner_job',
    'house_no',
    'job_place',
    'nic_number',
    'phone_number',
    'image',
    'fingur_signs',
    'second_fingur',
    'description',
    'user_id'
];



    public function car()
    {
        return $this->hasMany(Car::class);
    }

    public function sponser()
    {
        return $this->belongsTo(Sponsor::class);
    }

    // دایمي ولایت
    public function permanentProvince()
    {
        return $this->belongsTo(Province::class, 'permenant_prov_add');
    }

    // دایمي ولسوالۍ
    public function permanentDistrict()
    {
        return $this->belongsTo(District::class, 'permenant_dist_add');
    }

    // اوسنی ولایت
    public function currentProvince()
    {
        return $this->belongsTo(Province::class, 'current_prov_add');
    }

    // اوسنی ولسوالۍ
    public function currentDistrict()
    {
        return $this->belongsTo(District::class, 'current_dist_add');
    }

}
