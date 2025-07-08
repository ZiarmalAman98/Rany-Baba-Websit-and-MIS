<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{

    use HasFactory;

    // app/Models/Driver.php
    protected $fillable = [
        'drive_name',
        'driver_lname',
        'driver_fname',
        'nice_number',
        'phone_number',
        'gender',
        'permenant_prov_add',
        'permenant_dis_add',
        'permenant_village',
        'current_prov_add',
        'current_dis_add',
        'current_village',
        'car_id',
        'description',
        'user_id'
    ];



    public function per_province()
    {
        return $this->belongsTo(Province::class, 'permenant_prov_add', 'id');
    }

    public function cur_province()
    {
        return $this->belongsTo(Province::class, 'current_prov_add', 'id');
    }


    public function cur_district()
    {
        return $this->belongsTo(District::class, 'current_dis_add', 'id');
    }


    public function per_disrict()
    {
        return $this->belongsTo(District::class, 'permenant_dis_add', 'id');
    }
}
