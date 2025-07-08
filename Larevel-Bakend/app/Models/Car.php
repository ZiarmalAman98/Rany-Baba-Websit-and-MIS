<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [

        'plate_no',
        'company_name',
        'create_date',
        'direction_id',
        'shase_no',
        'Engine_no',
        'oil_type',
        'car_color',
        'create_county',
        'sale_date',
        'saler_info',
        'change_add',
        'owner_id',
        'user_id',
        'description'

    ];

    public function owner()
    {
        return $this->belongsTo(Owner::class);
    }
    public function direction()
    {
        return $this->belongsTo(Direction::class);
    }
}
