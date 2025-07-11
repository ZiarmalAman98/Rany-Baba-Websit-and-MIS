<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'province_id', 'user_id', 'created_at', 'updated_at'];



    public function province()
    {
        return $this->belongsTo(Province::class);
    }

    public function owner()
    {
        return $this->hasMany(Owner::class);
    }

    public function sponser()
    {
        return $this->hasMany(Sponsor::class);
    }

    public function driver()
    {
        return $this->hasMany(Driver::class);
    }
}
