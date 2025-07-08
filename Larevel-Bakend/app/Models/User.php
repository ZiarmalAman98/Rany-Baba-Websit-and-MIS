<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * د mass assignment لپاره د اجازې ورکولو ساحې.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'last_name',
        'email',
        'phone_number',
        'gender',
        'image',
        'password',
        'user_type',
        'status',
        'user_id',
    ];


    /**
     * هغه برخې چې باید له JSON serialization پټې پاتې شي.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * هغه برخې چې باید cast شي.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        // که Laravel >= 10 وي، hashed به کار وکړي، که نه، دا له منځه یوسه
        'password' => 'hashed',
    ];

    /**
     * د ځانګړي کارونکي اخیستل د ID له لارې.
     *
     * @param int $id
     * @return static|null
     */
    public static function getSingle($id)
    {
        return self::find($id);
    }

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }
}
