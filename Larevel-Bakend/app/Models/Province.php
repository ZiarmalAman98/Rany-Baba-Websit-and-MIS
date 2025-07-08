<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'user_id', 'created_at', 'updated_at'];


    public function district()
    {
        return $this->hasMany(District::class);
    }

    public function owner()
    {
        return $this->hasMany(Owner::class, '');
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
