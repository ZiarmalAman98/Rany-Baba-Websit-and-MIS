<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sponsor extends Model
{
    use HasFactory;

    protected $fillable = [
        'sponser_name',
        'sponsor_fname',
        'phone_number',
        'permenant_prov_add',
        'permenant_dis_add',
        'current_prov_add',
        'current_dis_add',
        'approval_barharli',
        'gender',
        'sponsor_image',
        'current_village',
        'permenant_village',
        'user_id',
        'owner_id'
    ];

    // مالک
    public function owner()
    {
        return $this->belongsTo(Owner::class, 'owner_id');
    }

    // دایمي ولایت
    public function permanentProvince()
    {
        return $this->belongsTo(Province::class, 'permenant_prov_add');
    }

    // دایمي ولسوالۍ
    public function permanentDistrict()
    {
        return $this->belongsTo(District::class, 'permenant_dis_add');
    }

    // اوسنی ولایت
    public function currentProvince()
    {
        return $this->belongsTo(Province::class, 'current_prov_add');
    }

    // اوسنی ولسوالۍ
    public function currentDistrict()
    {
        return $this->belongsTo(District::class, 'current_dis_add');
    }
}
